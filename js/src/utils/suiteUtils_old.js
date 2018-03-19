/**
 * Created by xlm on 2016/12/14.
 */

/**
 * 元表单模板解析器，将suite转化成想要的格式
 * @param data
 */
export function suiteResolver_old(data) {
    let meta = data.suite.nodes       //元数据模板
    let nodeData = !isUndefined(data.node_data) && data.node_data ? data.node_data : {}
    let nodeAttr = !isUndefined(data.node_attr) && data.node_attr ? data.node_attr : {}

    let newNodeData = {
        node_data: {},      //node_data
        node_attr: {}       //node_attr
    }
    let structure = traversalChildren(nodeData, nodeAttr, meta, newNodeData.node_data, newNodeData.node_attr, isEmptyObject(nodeData))
    return structure
}

export function suiteNodeResolver(meta, data) {
    let nodeData = data.nodeData
    let nodeAttr = data.nodeAttr
    let newNodeData = {
        node_data: {},
        node_attr: {}
    }
    let structure = traversalChildren(nodeData, nodeAttr, meta, newNodeData.node_data, newNodeData.node_attr, isEmptyObject(nodeData))
    return structure
}

/**
 *
 * 孩子节点解析器
 * @param nodeData 已存在的node_data数据
 * @param nodeAttr 已存在的node_attr数据
 * @param parent   template
 * @param node_data 导出的新node_data数据结构
 * @param node_attr 导出的新node_attr数据结构
 * @param firstInit
 * @returns {{node_data: *, node_attr: *}}
 */
function traversalChildren(nodeData, nodeAttr, parent, node_data, node_attr, firstInit) {
    //处理node_data 有value_type属性是组件层节点
    let initialValue
    if (!isUndefined(parent.value_type) && parent.value_type !== 'Object') {
        let currentValue = !nodeData || isUndefined(nodeData[parent.key]) ? null : nodeData[parent.key]
        node_data[parent.key] = getDefaultValue(currentValue, parent.initial_value)
    } else {
        //若nodeData[nodeName]已存在取nodeData[nodeName]，否则为空对象，和suite里的值进行合并
        //要考虑对象被删除的情况
        let currentValue = !nodeData || isUndefined(nodeData[parent.key]) ? null : nodeData[parent.key]
        initialValue = parent.initial_value ? parent.initial_value : (parent.children && parent.children.length > 0 ? {} : null)
        if (currentValue == null && initialValue != null) {
            node_data[parent.key] = initialValue
        } else if (currentValue != null && initialValue != null) {
            node_data[parent.key] = Object.assign({}, initialValue, currentValue)
        } else {
            node_data[parent.key] = currentValue
        }
    }

    //只在模块层处理node_attr
    if(parent.initial_attribute) {
        node_attr[parent.key] = nodeAttr[parent.key] ? nodeAttr[parent.key] : parent.initial_attribute
    }else {
        node_attr[parent.key] = nodeAttr[parent.key] ? nodeAttr[parent.key] : (parent.value_type == 'Array' ? [] : {})
    }

    //处理loader分支
    if(parent.loader_config && parent.loader_config.children) {
        parent.loader_config.children.map((child) => {
            child.content.map((item) => {
                continueFindChildren(parent, item, firstInit)
            })
        })
    }
    //处理组件分支
    if (parent.children && parent.children.length > 0 && !isUndefined(parent.children)) {
        parent.children.map((child) => {
            continueFindChildren(parent, child, firstInit)
        })
    }

    function continueFindChildren(parent, child, firstInit) {
        let nodeDataTmp = isUndefined(nodeData[parent.key]) ? {} : nodeData[parent.key]
        let nodeAttrTmp = isUndefined(nodeAttr[parent.key]) ? {} : nodeAttr[parent.key]

        node_data[parent.key] = node_data[parent.key] || {}

        if(parent.value_type == 'Array' && !nodeAttr[parent.key]) {
            node_attr[parent.key][0] = {}
        }else {
            node_attr[parent.key] = node_attr[parent.key] || {}
        }
        traversalChildren(nodeDataTmp, nodeAttrTmp, child, node_data[parent.key], parent.value_type == 'Array' && !nodeAttr[parent.key] ? node_attr[parent.key][0] : node_attr[parent.key], firstInit)
    }

    return {node_data, node_attr}
}

/**
 * 根据suite模板和nodeData综合解析数据结构
 * @param firstInit
 * @param nodeValue
 * @param initialValue
 * @returns {null}
 */
function getDefaultValue(nodeValue, initialValue) {
    //if(firstInit) {  //第一次初始化
    //    return (suiteValue || (suiteValue == '0') ? suiteValue : null)
    //}else {
    //    return (!isUndefined(nodeValue) && nodeValue != null ? nodeValue : suiteValue )
    //}
    if (nodeValue != null) {
        return nodeValue
    } else {
        return !isUndefined(nodeValue) ? initialValue : null
    }
}

/**
 * 解决路由跳转太快导致元表单配置取的数据未与之匹配
 * 根据路由变化匹配当前模块的数据
 * @param suiteNodes
 * @param nodeName
 * @returns {*}
 */
export function findSuiteNodes(suiteNodes, nodeName) {
    let result = null

    if (isUndefined(suiteNodes.get('children')) || nodeName === '') {
        return null
    }

    if (suiteNodes.get('key') != nodeName) {
        suiteNodes.get('children').map((node) => {
            if (exitFind(node, nodeName)) {
                result = node.get('children')
            }
        })

        //如果父节点中有匹配的key,则返回结果,否则继续查找子节点
        if (result) {
            return result
        }

        suiteNodes.get('children') && suiteNodes.get('children').map((node) => {
            continueFind(node, nodeName)
        })
    }

    /**
     * 是否要退出查找
     * @param suiteNodes
     * @param nodeName
     * @returns {boolean}
     */
    function exitFind(suiteNodes, nodeName) {
        return suiteNodes.get('key') == nodeName ? true : false
    }

    /**
     * 继续查找子节点
     * @param suiteNodes
     * @param nodeName
     */
    function continueFind(suiteNodes, nodeName) {
        suiteNodes && suiteNodes.get('children') && suiteNodes.get('children').map((node) => {
            findSuiteNodes(node, nodeName)
        })
    }

    return suiteNodes.get('children')
}
/**
 * 根据nodeName查找节点模板数据。
 * @param suiteNodes
 * @param nodeName
 * @returns {null}
 */
export function recursionFindSuiteNodes(suiteNodes, nodeName) {
    if (suiteNodes && suiteNodes.get('children') && nodeName !== '') {
        return recursionFind(suiteNodes.get('children'), nodeName)
    } else {
        return null
    }
}
/**
 * 递归查找模板数据。
 * @param suiteNodes
 * @param nodeName
 * @returns {*}
 */
function recursionFind(suiteNodes, nodeName) {
    if (suiteNodes && nodeName !== '') {
        //两种遍历方式。第一种，查找第一个满足条件的节点。
        for (let i = 0; i < suiteNodes.size; i++) {
            let item = suiteNodes.get(i)
            if (item.get('key') === nodeName) {
                return item
            } else {
                item = recursionFind(suiteNodes.get('children'), nodeName)
                if (item != null) {
                    return item
                }
            }
        }
    }
    return null
}

/**
 * 判断data是否undefined
 * @param data
 * @returns {boolean}
 */
function isUndefined(data) {
    if (typeof data == 'undefined') {
        return true
    } else {
        return false
    }
}

/**
 * 判断对象是否为空
 * @param obj
 * @returns {boolean}
 */
export function isEmptyObject(obj) {
    for (let key in obj) {
        return false
    }
    return true
}

export function objectValues(obj) {
    return Object.keys(obj).map(key => obj[key])
}
/**
 * 返回数组中指定元素的数目
 * @param array 数组
 * @param item  指定元素
 */
export function count(array, item) {
    return array.filter((x) => {
        return x === item
    }).length
}
