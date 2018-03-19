/**
 * Created by suncg on 2017/3/21.
 */
// import {DISCUSS_PEOPLE_ARR} from '../constants/constants'

export default {
    getDicussPeopleFilter(text, i) {
        switch(i) {
        case 0:
            return null
        case 1:
            return '刘德建_汪松_金伟华'
        case 2:
            return '汪松_金伟华'
        case 3:
            return '刘德建'
        case 4:
            return '汪松'
        case 5:
            return '金伟华'
        default:
            return text
        }
    }

}
