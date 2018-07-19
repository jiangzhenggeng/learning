var tool = {
  random (min = 0, max = 9999999) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  generateArr (len) {
    let arr = []
    for (var i = 0; i < len; i++) {
      arr.push(this.random(1, len))
    }
    return arr
  },
}

let algorithm = {
  //快速排序
  quickSortV1 (arr) {

    if (arr.length <= 1) {
      return arr
    }

    let mid = parseInt((arr.length - 1) / 2)
    let leftArray = []
    let rightArray = []
    let eq = []

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] < arr[mid]) {
        leftArray.push(arr[i])
      }
      if (arr[i] > arr[mid]) {
        rightArray.push(arr[i])
      }
      if (arr[i] == arr[mid]) {
        eq.push(arr[i])
      }
    }

    leftArray = this.quickSortV1(leftArray)
    rightArray = this.quickSortV1(rightArray)

    return leftArray.concat(eq, rightArray)

  },
  //快速排序(优化版1)
  quickSortV2 (arr, left, right) {
    left = left || 0
    right = right || arr.length - 1
    if (left < right) {

      let swap = function (arr, i, j) {
        var temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
      }

      let partition = function (arr, left, right) {
        let index = left
        let povit = arr[right]// 直接选最右边的元素为基准元素

        for (let i = left; i < right; i++) {
          if (arr[i] < povit) {
            swap(arr, i, index)
            // 交换位置后，index 自增 1，代表下一个可能要交换的位置
            index++
          }
        }
        // 将基准元素放置到最后的正确位置上
        if (arr[index] != arr[right]) {
          swap(arr, index, right)
        }
        return index
      }

      let partitionIndex = partition(arr, left, right)
      if (left < partitionIndex - 1) {
        this.quickSortV2(arr, left, partitionIndex - 1)
      }
      if (partitionIndex + 1 < right) {
        this.quickSortV2(arr, partitionIndex + 1, right)
      }
    }
    return arr
  },
  //快速排序(优化版2)
  quickSortV3 (arr, left, right) {
    left = left || 0
    right = right || arr.length - 1
    if (left < right) {

      let swap = function (arr, i, j) {
        var temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
      }

      let partition = function (arr, left, right) {
        let mid = left
        left = left + 1

        while (left <= right) {
          while (arr[left] < arr[mid]) {
            left++
          }
          while (arr[mid] < arr[right]) {
            right--
          }
          if (left < right) {
            if (arr[left] != arr[right]) {
              swap(arr, left, right)
            }
            left++
            right--
          }
        }
        // 将基准元素放置到最后的正确位置上
        if (arr[mid] != arr[right]) {
          swap(arr, mid, right)
        }
        return right
      }

      let partitionIndex = partition(arr, left, right)
      if (left < partitionIndex - 1) {
        this.quickSortV2(arr, left, partitionIndex - 1)
      }
      if (partitionIndex + 1 < right) {
        this.quickSortV2(arr, partitionIndex + 1, right)
      }
    }
    return arr
  },
  //二分查找
  binarySearchV1 (target, array, start, end) {

    start = start || 0
    end = end || array.length - 1
    let mid = Math.floor((start + end) / 2)

    if (mid < 0) {
      return -1
    }

    let base = array[mid]
    if (target < base) {
      return this.binarySearch(target, array, start, mid - 1)
    } else if (target > base) {
      return this.binarySearch(target, array, mid + 1, end)
    } else {
      return mid
    }
    return -1
  },
  //二分查找(优化版)
  binarySearchV2 (target, array, start, end) {
    start = start || 0
    end = end || array.length - 1
    let mid
    while (start < end) {
      mid = Math.floor((start + end) / 2)
      if (mid < 0) return -1
      if (target < array[mid]) {
        end = mid - 1
      } else if (target > array[mid]) {
        start = mid + 1
      } else {
        return mid
      }
    }
    return -1
  },
}

let arr = tool.generateArr(10000)

let arr1 = arr.slice()
let arr2 = arr.slice()
let arr3 = arr.slice()

console.time('xm')
algorithm.quickSortV1(arr1)
console.timeEnd('xm')

console.time('xm')
algorithm.quickSortV2(arr2)
console.timeEnd('xm')

console.time('xm')
algorithm.quickSortV3(arr3)
console.timeEnd('xm')