export default {
  data() {
    return {
      currentPage: 1,
      totalNum: 0,
      pageSize: 10,
      shownData: []
    }
  },
  methods: {
    handleFirstShow(tableData) {
      this.handleCurrentChange(tableData);
    },
    handleSizeChange(tableData) {
      this.shownData = tableData.slice((this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize);
    },
    handleCurrentChange(tableData) {
      // console.log('当前页：' + this.currentPage)
      this.handleSizeChange(tableData);
    }
  }
}
