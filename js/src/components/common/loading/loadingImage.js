import styles from 'styles/components/common/loading/loading.css'

import React from 'react'

export default React.createClass({
    displayName: 'Loading',
    propTypes: {
        isLoading: React.PropTypes.bool.isRequired
    },
    render() {
        return (
            <div className={ `${this.props.isLoading === true ? styles.show_image : styles.hide_image } ${this.props.className}`}></div>
        )
    }
})
