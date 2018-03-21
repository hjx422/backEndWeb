/**
 * Created by hjx on 7/27/2017.
 */
import { Provider, connect } from 'react-redux'
import Example from '../components/example/example.js'
import * as i18 from '../actions/i18n.js'
import * as example from '../actions/example.js'

function mapStateToProps(state) {
  const curLang = state.global.curLang
  return {
    examples: state[curLang].examples
  }
}

function mapDispatchToProps(dispatch) {
  return {
    switchLanguage: () => dispatch(i18.switchLanguage()),
    getExamples: () => dispatch(example.getExamples())
  }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(Example)
