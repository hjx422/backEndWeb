/**
 * Created by cpoopc on 2016/12/9.
 */
import React, {PropTypes, Component, createElement} from 'react'
/**
 * 把immutable对象转成普通对象,
 * 让_component直接操作普通对象
 * _concernFields,_shouldComponentUpdate两者其中一个为空则不实现shouldComponentUpdate逻辑
 * @param _component
 * @param _immutableFields props中需要转换的immutable对象
 * @param _concernFields 关心的field,当props[field]变化时会引起更新
 * @param _shouldComponentUpdate(curProps, nextProps, curState, nextProps) 组件根据自身关心的属性定制的是否需要更新逻辑
 * @returns {ImmutableWrapper}
 * @constructor
 */
export default function WrapComp(WrapComponent, _immutableFields = [], _concernFields = [], _shouldComponentUpdate = ()=>false) {
  return class ImmutableWrapper extends Component {

    static type = 'ImmutableWrapper'
    static propTypes = {
      keyName: PropTypes.string
    }

    static displayName = 'ImmutableWrapper'

    constructor(props) {
      super(props)
      let initState = {}
      for(let field of _immutableFields) {
        initState[field] = this.props[field] && this.props[field].toJS ? this.props[field].toJS() : this.props[field]
      }
      this.state = initState
    }

    componentWillReceiveProps(nextProps) {
      let mergeState
      for(let field of _immutableFields) {
                // props[field]改变时更新到state
        if(this.props[field] != nextProps[field]) {
          mergeState = mergeState || {}
          mergeState[field] = nextProps[field] && nextProps[field].toJS ? nextProps[field].toJS() : nextProps[field]
        }
      }
      if(mergeState) {
                this.setState(mergeState) // eslint-disable-line
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      if(!_concernFields || !_shouldComponentUpdate) {
                // 这两者其中一个为空则不实现shouldComponentUpdate逻辑
        return true
      }
      let shouldUpdate = false
      for(let field of _concernFields) {
        if(this.props[field] != nextProps[field]) {
          shouldUpdate = true
          break
        }
      }
      shouldUpdate = shouldUpdate || this.state != nextState
                || _shouldComponentUpdate(this.props, nextProps, this.state, nextState)
      shouldUpdate && console.log(`shouldUpdate:`,shouldUpdate)
      return shouldUpdate
    }

    get() {
      return this.refs.wrapped
    }

    render() {
      if(!this.renderCount) {
        this.renderCount = 1
      }else {
        this.renderCount++
      }
      this.props.keyName && console.log(`--render--${this.props.keyName}:${this.renderCount}`)
      let wrapperFields = {}
      for(let field of _immutableFields) {
        wrapperFields[field] = this.state[field]
      }
      return <WrapComponent ref='wrapped' {...this.props} {...wrapperFields}/>
    }
    }
}
