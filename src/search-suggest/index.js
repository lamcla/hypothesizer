var PouchDB = require('pouchdb');

var db_name = '_db';
if (location.pathname.contains('_rewrite')) {
  db_name = location.pathname.split('/')[1];
}

var db = new PouchDB(location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/' + db_name + '/');



module.exports = {
  replace: true,
  template: require('./template.html'),
  paramAttributes: ['view', 'placeholder', 'basehref'],
  data: function() {
    return {
      search: '',
      results: []
    };
  },
  watch: {
    search: 'loadResults'
  },
  methods: {
    submit: function() {
      location.href = this.basehref + encodeURIComponent(this.results[0].key);
    },
    loadResults: function() {
      var self = this;
      this.results = [];
      db.query(self.view,
        {limit: 10, startkey: [self.search], group_level: 1},
        function(err, resp) {
          self.results = resp.rows;
        });
    }
  },
  filters: {
    encodeURIComponent: function(v) {
      return encodeURIComponent(v);
    }
  }
};
