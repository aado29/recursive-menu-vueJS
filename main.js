const getNestedNodes = (arr, data = {id: 'id', parent: 'parent_id'}, parent = null ) => {
  var out = []
  for (var i in arr) {
    if (arr[i][data.parent] === parent) {
      var nodes = getNestedNodes(arr, data, String(arr[i][data.id]))
      if(nodes.length) {
        arr[i].nodes = nodes
      }
      out.push(arr[i])
    }
  }
  return out
}

new Vue({
  el: '#app',
  data: {
    nodes: []
  },
  methods: {
    getData() {
      const self = this
      axios.get('https://api.adetec.dmeat.cl/api/categories')
        .then(function(response) {
          self.nodes = getNestedNodes(response.data.data)
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  },
  mounted() {
    this.getData()
  }
})

Vue.component('node', {
  template: '#node',
  props: ['nodes', 'label', 'depth'],
  data: function data() {
    return {
      showChildren: false
    }
  },

  computed: {
    iconClasses: function iconClasses() {
      return {
        'fa-angle-down': !this.showChildren,
        'fa-angle-up': this.showChildren
      }
    },
    labelClasses: function labelClasses() {
      return { 'has-children': this.nodes ? true : false }
    },
    indent: function indent() {
      return {
        marginLeft: this.depth * 25 + 'px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }
    }
  },
  methods: {
    toggleChildren: function toggleChildren() {
      this.showChildren = !this.showChildren
    }
  }
})