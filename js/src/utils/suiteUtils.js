/**
 * Created by xlm on 2016/12/14.
 */

import { getIn } from '../utils/immutableUtils'

/**
 * 模板解析
 * @param data
 * @param level
 * @returns {{node_data, node_attr}|*}
 */
export function suiteResolver(data, level = 2) {
    let meta = data.suite.nodes       //元数据模板
    let nodeData = !isUndefined(data.node_data) && data.node_data ? data.node_data : {}
    let nodeAttr = !isUndefined(data.node_attr) && data.node_attr ? data.node_attr : {}

    let newNodeData = {
        node_data: {},      //node_data
        node_attr: {}       //node_attr
    }
    let structure = traversalChildren(nodeData, nodeAttr, meta, newNodeData.node_data, newNodeData.node_attr, level)
    console.log('resolve', structure)
    return structure
}

/**
 * 可变模板节点解析
 * @param nodeName
 * @param meta
 * @param data
 * @returns {{node_data, node_attr}|*}
 */
export function suiteNodeResolver(meta, data, level) {
    let nodeData = data.nodeData
    let nodeAttr = data.nodeAttr
    let newNodeData = {
        node_data: {},
        node_attr: {}
    }
    let structure = traversalChildren(nodeData, nodeAttr, meta, newNodeData.node_data, newNodeData.node_attr, level)
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
 * @param level 模板需要解析的层数
 * @returns {{node_data: *, node_attr: *}}
 */
function traversalChildren(nodeData, nodeAttr, config, node_data, node_attr, level) {
    //只解析到模块层
    let initialValue = getIn(config, 'initial_value')
    let initialAttr = getIn(config, 'initial_attribute')

    //先获取nodeData和nodeAttr的初始数据
    if(nodeData) node_data = nodeData
    if(nodeAttr) node_attr = nodeAttr

    node_data[config.key] = nodeData[config.key] ? nodeData[config.key] : (initialValue ? initialValue : {})
    node_attr[config.key] = nodeAttr[config.key] ? nodeAttr[config.key] : (initialAttr ? initialAttr : {})

    //根据模板情况定义需要解析的层数，当level = 1时退出遍历
    if(level > 1) {
        level -= 1
        if(!nodeData[config.key] && !nodeAttr[config.key]) {
            nodeData[config.key] = initialValue ? initialValue : {}
            nodeAttr[config.key] = initialAttr ? initialAttr : {}
        }

        config.children && config.children.map((child) => {
            traversalChildren(nodeData[config.key], nodeAttr[config.key], child, node_data[config.key], node_attr[config.key], level)
        })
    }

    return {node_data, node_attr}
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
        //两种遍历方式。第二种，查找所有满足条件的节点。
        // return suiteNodes.filter((item)=> {
        //     if (item.get('key') === nodeName) {
        //         return true
        //     } else {
        //         findSuiteNodes2(suiteNodes.get('children'), nodeName)
        //     }
        // })
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
