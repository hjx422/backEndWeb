/**
 * Created by cpoopc on 2016/6/28.
 */
/**
 * 帮助判断组件数据是否改变(是否需要保存)工具类
 * usage
   component:
 1. bind function
     this.isDirty = DataUtil.isDirty.bind(this)
     this.updateDataSnapshot = DataUtil.updateDataSnapshot.bind(this)
     this.onComponentWillReceiveProps = DataUtil.onComponentWillReceiveProps.bind(this)
 2. 实现dataSnapshot()
 3. props.fetching 获取数据标志
 4. 当数据保存的时候,调用updateDataSnapshot更新
 然后就可以调用isDirty来判断数据是否改变

 */
import HistoryUtil from './historyUtil'

export default {
    /**
     * 判断内容是否改变
     * @returns {boolean}
     */
    isDirty(_props) {
        if(_props.fetching) return false
        let snapshot = JSON.stringify(this.dataSnapshot())
        if(snapshot && this.snapshot) {
            return snapshot != this.snapshot
        }
        return false


    },

    /**
     * 更新数据快照
     * 数据加载完毕,记录数据快照;
     * 数据保存完毕,更新数据快照
     * @param useCustomSnapshot
     * @param snapshot
     */
    updateDataSnapshot(useCustomSnapshot, snapshot) {

        if(useCustomSnapshot) {
            this.snapshot = JSON.stringify(snapshot)
        }else {
            this.snapshot = JSON.stringify(this.dataSnapshot())
        }
    },
    /**
     * 获取数据完成后,记录快照
     * @param nextProps
     * @param addFirstSnapMethod 第一步快照初始值,不传则默认调用HistoryUtil.addSnap({})
     */
    onComponentWillReceiveProps(nextProps,addFirstSnapMethod) {
        if(this.props.fetching && !nextProps.fetching) {
            // 因为dataSnapshot是根据props生成的,所以需要做个延迟.等待被nextProps覆盖.
            setTimeout((()=> {
                this.updateDataSnapshot()
                //撤销重做快照初始值
                if(addFirstSnapMethod) {
                    addFirstSnapMethod()
                }else {
                    HistoryUtil.addSnap({})
                }
            }).bind(this), 0)
        }
    },

    onComponentDidMount(addFirstSnapMethod) {
        if(!this.props.fetching) {
            // 因为dataSnapshot是根据props生成的,所以需要做个延迟.等待被nextProps覆盖.
            setTimeout((()=> {
                this.updateDataSnapshot()
                //撤销重做快照初始值
                if(addFirstSnapMethod) {
                    addFirstSnapMethod()
                }else {
                    HistoryUtil.addSnap({})
                }
            }).bind(this), 0)
        }
    }
}
