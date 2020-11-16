/**
 * Default options for SVG Japan
 */
export const Defaults = {
    //element:    "{Selector}"
    type:         "full",
    stroked:      true,
    //strokeColor:  "#333333",
    //activeColor:  "#D70035",
    withTips:     true,
    regionality:  false,
    regions:      null,
    uniformly:    false,
    uniformColor: "#C0C0C0",
    prefColors:   {
        //e.g.    'Tokyo': '#717477',
    },
    //width:      "100%",
    //height:     "calc(100vh - 20px)"
}

/**
 * Default regions for SVG Japan
 */
export const Regions = [
    // 
    { id: 1,  name: "\u5317\u6d77\u9053", prefs: [ 1 ],                          color: "#689ECA", active: "#F3FF15" },
    { id: 2,  name: "\u6771\u5317",       prefs: [ 2, 3, 4, 5, 6, 7 ],           color: "#4DA9CE", active: "#F3FF15" },
    { id: 3,  name: "\u95a2\u6771",       prefs: [ 8, 9, 10, 11, 12, 13, 14 ],   color: "#9899C9", active: "#F3FF15" },
    { id: 4,  name: "\u4e2d\u90e8",       prefs: [ 15, 16, 17, 18, 19, 20, 21, 22, 23 ], color: "#9AD47F", active: "#F3FF15" },
    { id: 5,  name: "\u8fd1\u757f",       prefs: [ 24, 25, 26, 27, 28, 29, 30 ], color: "#B3DD53", active: "#F3FF15" },
    { id: 6,  name: "\u4e2d\u56fd",       prefs: [ 31, 32, 33, 34, 35 ],         color: "#ECDD28", active: "#F3FF15" },
    { id: 7,  name: "\u56db\u56fd",       prefs: [ 36, 37, 38, 39 ],             color: "#FDB42A", active: "#F3FF15" },
    { id: 8,  name: "\u4e5d\u5dde\u30fb\u6c96\u7e04", prefs: [ 40, 41, 42, 43, 44, 45, 46, 47 ], color: "#F96F39", active: "#F3FF15" },
]
