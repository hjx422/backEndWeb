/**
 * Created by hjx on 7/26/2017.
 */
import React, { PropTypes } from 'react'
import { intlShape, defineMessages, FormattedMessage } from 'react-intl'
import IntlUtil from 'i18n/intlUtil'

const prefix = 'components.example.example'
const message = defineMessages({
  switchlang: {
    id: `${prefix}.switchlang`,
    defaultMessage: '切换语言',
    description: 'switchlang'
  }
})

export default class Example extends React.Component {

  constructor(props) {
    super(props)
    this._onClick = this.onClick.bind(this)
  }

  componentDidMount() {
    this.props.getExamples()
  }

  onClick() {
    this.props.getExamples()
    this.props.switchLanguage()
  }

  renderExamples() {
    return this.props.examples.map((example) => {
      return <h3>{example}</h3>
    })
  }

  render() {
    return (
      <div>
        <h1 onClick={this._onClick}>{IntlUtil.formatMessage(this, message.switchlang)}</h1>
        {this.renderExamples()}
      </div>
    )
  }
}

Example.propTypes = {
  examples: PropTypes.string,
  switchLanguage: PropTypes.func,
  getExamples: PropTypes.func
}

Example.contextTypes = {
  intl: intlShape
}
