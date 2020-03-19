/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {
  Button,
  SectionHeading,
  Icon,
  Paragraph,
  Subheading,
  HelpText
} from '@contentful/forma-36-react-components';
import { init, locations } from 'contentful-ui-extensions-sdk';
import tokens from '@contentful/forma-36-tokens';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export class DialogExtension extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  render() {
    return (
      <div style={{ margin: tokens.spacingM }}>
        <Button
          testId="close-dialog"
          buttonType="muted"
          onClick={() => {
            this.props.sdk.close('data from modal dialog');
          }}>
          Close modal
        </Button>
      </div>
    );
  }
}

export class SidebarExtension extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.supportedTags = [
      {
        name: 'Box',
        description:
          'Used to as a regular html div. It is useful if you want to display a simple element and apply a few styles. The code snippet shows an example usage',
        snippet: (
          <div>
            {`<Box>
                Hello, I am a simple box
            </Box>`}
          </div>
        ),
        properties: [
          {
            name: 'type',
            description: 'Decides if it is of type "flex", "block" etc. The default is "block"',
            required: true,
            acceptedValues: [
              { flex: 'Children are arranged in a flexbox' },
              { block: 'Displays as a simple block elemennt' }
            ],
            default: 'flex'
          },
          {
            name: 'orientation',
            description:
              'Used to specify if Box would arrange children horizontally or as a stack. Defaults to "Column"',
            required: false,
            acceptedValues: [
              { column: 'Children are arranged in a Stack' },
              { row: 'Children are arrannged side by side' }
            ],
            default: 'row'
          }
        ]
      },
      {
        name: 'Link',
        description:
          'Used to include a reference to an external resource / page or some where within the current page or site',
        snippet: (
          <div>
            {`<Link href="//facebook.movinga.com">
                Checkout Movinga on facebook!!
            </Link>`}
          </div>
        ),
        properties: []
      }
    ];

    this.state = {
      selectedTag: null
    };
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
  }

  onButtonClick = async () => {
    const result = await this.props.sdk.dialogs.openExtension({
      width: 800,
      title: 'The same extension rendered in modal window'
    });
    console.log(result);
  };

  render() {
    return (
      <div style={{ maxHeight: '299px', minHeight: '299px' }}>
        <SectionHeading>Supported Tags</SectionHeading>
        {!this.state.selectedTag && (
          <ul>
            {this.supportedTags.map((tag, i) => (
              <li
                key={i}
                onClick={() => this.setState({ selectedTag: this.supportedTags[i] })}
                style={{
                  textDecoration: 'underline',
                  color: 'red',
                  marginBottom: '8px',
                  cursor: 'pointer'
                }}>{`<${tag.name}>`}</li>
            ))}
          </ul>
        )}

        {this.state.selectedTag && (
          <div>
            <p
              style={{
                color: 'red',
                marginBottom: '8px',
                cursor: 'pointer'
              }}>
              <Button
                onClick={() => this.setState({ selectedTag: null })}
                buttonType="naked"
                style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                <Icon color="primary" size="large" icon="ChevronLeft" />
              </Button>
              {`<${this.state.selectedTag.name}>`}
            </p>
            <Paragraph>{this.state.selectedTag.description}</Paragraph>

            <code style={{ padding: '4rem' }}>{this.state.selectedTag.snippet}</code>

            <Subheading style={{ color: '#3c80cf' }}>Properties</Subheading>
            {this.state.selectedTag.properties.map((property, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <Paragraph style={{ backgroundColor: '#e5ebed', display: 'inline-block' }}>
                  {property.name}
                  {property.required && <HelpText style={{ color: 'red', display: 'inline', marginLeft: '5px' }}>(Required)</HelpText>}
                </Paragraph>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export const initialize = sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    ReactDOM.render(<DialogExtension sdk={sdk} />, document.getElementById('root'));
  } else {
    ReactDOM.render(<SidebarExtension sdk={sdk} />, document.getElementById('root'));
  }
};

init(initialize);

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
