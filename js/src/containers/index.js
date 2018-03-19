import { Provider, connect } from 'react-redux'
import Index from '../components/index.js'

function mapStateToProps(state) {
    return {
        isLoading: false
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(Index)
