export default {
  data() {
    return {
      tableHeight: this.getTableHeight()
    }
  },

  methods: {
    getTableHeight() {
      let screenHeight = window.innerHeight;
      let occupied = 70 + 90 + 65;
      this.tableHeight = screenHeight - occupied;
    }
  },

  mounted() {
    this.getTableHeight();
    window.addEventListener('resize', this.getTableHeight);
  }
}
