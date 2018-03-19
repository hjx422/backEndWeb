import styles from './loading.css'

import React from 'react'

export default React.createClass({
    displayName: 'Loading',
    propTypes: {
        isLoading: React.PropTypes.bool.isRequired
    },
    render() {
        return (
            <div className={ this.props.isLoading === true ? styles.show : styles.hide }></div>
        )
    }
})
