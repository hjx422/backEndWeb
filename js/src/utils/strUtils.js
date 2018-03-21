const SPLIT_CHARS = [',', '，', ';', '；', '、']
export default {

  getMousePos(event) {
    let e = window.event
    let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft
    let scrollY = document.documentElement.scrollTop || document.body.scrollTop
    let x = e.pageX || e.clientX + scrollX
    let y = e.pageY || e.clientY + scrollY
    let arr = new Array()
    arr[0] = x
    arr[1] = window.innerHeight - y
    return arr
  },


  sqlStr() {
    let str = 'and,delete,or,exec,insert,select,union,update,count,*,join,>,<'
    return str
  },

  filterSqlStr(value) {
    let sqlStr = this.sqlStr().split(',')
    let flag = false
    for (let i = 0; i < sqlStr.length; i++) {
      if (value.toLowerCase().indexOf(sqlStr[i]) != -1) {
        flag = true
        break
      }
    }
    return flag
  },

  specialStr() {
    let str = '.,/,;,[,],*,(,),>,<,(,),&,^,%,$,#,@,!,~,`/,?'
    return str
  },

    /**
     * true包含特殊字符，false不包含特殊字符
     * @param value
     * @returns {boolean}
     */
  filterSpecialStr(value) {
    if (value == '') {
      return true
    }
        //不对特殊字符做限制
        // let specialStr = this.specialStr().split(',')
    let flag = false
        // for (let i = 0; i < specialStr.length; i++) {
        //     if (value.toLowerCase().indexOf(specialStr[i]) != -1) {
        //         flag = true
        //         break
        //     }
        // }
    return flag
  },

  filterSpecial(str) {
        // eslint-disable-next-line quotes
    let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]")
    let rs = ''
    for (let i = 0; i < str.length; i++) {
      rs = rs + str.substr(i, 1).replace(pattern, '')
    }
    return rs
  },

  checkInput(str) {
    let pattern = /^[\w\u4e00-\u9fa5]+$/gi
    if (pattern.test(str)) {
      return false
    }
    return true
  },

    /**
     * 通过指定字符将string转成array
     * @param str
     * @param splitCharacters
     * @returns {*}
     */
  splitStr2ArrayByCharacterArr(str, splitCharacters) {
    if (str) {
      let tempStr
      if (typeof str != 'string') {
        tempStr = str.toString()
      } else
                tempStr = str
      let regStrCharacters = ''
      if (splitCharacters.length > 1) {
        for (let character of splitCharacters) {
          regStrCharacters += character
        }
        return this.removeEmptyElementFromArray(tempStr.split(new RegExp('[' + regStrCharacters + ']')))
      } else if (splitCharacters.length == 1) {
        return this.removeEmptyElementFromArray(tempStr.split(splitCharacters[0]))
      } else {
        return []
      }
    } else {
      return []
    }
  },
    /**
     * 通过指定字符将string转成array
     * @param str
     * @param splitCharacters
     * @returns {*}
     */
  splitStr2ArrayByCharacters(str, ...splitCharacters) {
    if (splitCharacters.length == 0) {
      splitCharacters = SPLIT_CHARS
    }
    return this.splitStr2ArrayByCharacterArr(str, splitCharacters)
  },
  transArray2Str(array, joinChar) {
    if (Array.isArray(array)) {
      if (joinChar) {
        return array.join(joinChar)
      }
      return array.join('；')
    }
    return array || ''
  },

    /**
     * 文本框换行
     * @param str
     * @param splitCharacters
     * @returns {*}
     */
  replaceNewLine(str) {
    let arr
    let newArr = []
    if (str != null && str.indexOf('\n')) {
      arr = str.split('\n')
      arr.map((item, i) => {
        newArr.push(<p>{item}</p>)
      })
    } else {
      newArr.push(str)
    }
    return newArr
  },
  removeEmptyElementFromArray(array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] == '' || typeof(array[i]) == 'undefined') {
        array.splice(i, 1)
        i = i - 1
      }
    }
    return array
  },

    /**
     * 去掉数组重复的元素
     * */
  removeUniqueArray(data) {
    data = data || []
    let a = {}
    for (let i = 0; i < data.length; i++) {
      let v = data[i]
      if (typeof(a[v]) == 'undefined') {
        a[v] = 1
      }
    }

    data.length = 0
    for (let i in a) {
      data[data.length] = i
    }

    return data
  },
    /**
     * 从item中去除重复
     * 若没有重复则添加
     * @param ele string element
     * @param item string
     * @returns {*}
     * @param splitChars
     * @param defaultSplitChar
     */
  toggleStrElement(ele, item, defaultSplitChar, ...splitChars) {
    let itemArr
    let isRepeat = false
    let splitChar = defaultSplitChar ? defaultSplitChar : (splitChars.length > 0 ? splitChars[0] : ',')
    if (item == undefined || item == null) {
            // item = ''
      return ele || ''
    } else {
      itemArr = this.splitStr2ArrayByCharacterArr(item, splitChars.length > 0 ? splitChars : SPLIT_CHARS) //item.split(splitChar)
      itemArr.forEach((text, i) => {
        if (ele == text) {
          isRepeat = true
        }
      })
    }
    if (isRepeat) {
      let result = itemArr.filter((arr) => {
        return arr !== ele
      })
      itemArr = result.join(splitChar)
    } else {
      item = itemArr.filter((arr) => {
        return arr !== ''
      }).join(splitChar)
      itemArr = item == '' ? ele : item + splitChar + ele
    }
    return itemArr
  },
    /**
     * 去除前后空格
     * @returns {*}
     */
  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  },
  hashCode(string) {
    let hash = 0, i, chr, len
    if (string.length === 0) return hash
    for (i = 0, len = string.length; i < len; i++) {
      chr   = string.charCodeAt(i)
      hash  = ((hash << 5) - hash) + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }

}
