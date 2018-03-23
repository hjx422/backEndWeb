/**
 * Created by Administrator on 2018/3/21.
 */
import React, { PropTypes } from 'react'
import styles from './dashboard.css'

export default class Dashboard extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div className={styles['container']}>
        hello world
        { this.props.children }
      </div>
    )
  }
}
