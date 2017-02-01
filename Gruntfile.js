module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: [
      'public/'
    ],

    copy: {
      jsLib: {
        files: [{
          src: ['node_modules/angular/angular.min.js'],
          dest: 'public/js/lib/angular.min.js'
        }, {
          src: ['node_modules/angular/angular.min.js.map'],
          dest: 'public/js/lib/angular.min.js.map'
        }, {
          src: ['node_modules/angular-resource/angular-resource.min.js'],
          dest: 'public/js/lib/angular-resource.min.js'
        }, {
          src: ['node_modules/angular-resource/angular-resource.min.js.map'],
          dest: 'public/js/lib/angular-resource.min.js.map'
        }, {
          src: ['node_modules/angular-route/angular-route.min.js'],
          dest: 'public/js/lib/angular-route.min.js'
        }, {
          src: ['node_modules/angular-route/angular-route.min.js.map'],
          dest: 'public/js/lib/angular-route.min.js.map'
        }, {
          src: ['node_modules/material-design-lite/material.min.js'],
          dest: 'public/js/lib/material.min.js'
        }, {
          src: ['node_modules/material-design-lite/material.min.js.map'],
          dest: 'public/js/lib/material.min.js.map'
        }, {
          src: ['node_modules/ngstorage/ngStorage.min.js'],
          dest: 'public/js/lib/ngStorage.min.js'
        }, {
          src: ['node_modules/sweetalert/lib/sweet-alert.min.js'],
          dest: 'public/js/lib/sweet-alert.min.js'
        }, {
          src: ['node_modules/angular-sweetalert/SweetAlert.min.js'],
          dest: 'public/js/lib/ng-sweet-alert.min.js'
        }]
      },

      templates: {
        files: [{
          expand: true,
          cwd: 'client/templates/',
          src: ['*'],
          dest: 'public/templates/',
          filter: 'isFile'
        }]
      },

      cssLib: {
        files: [{
          src: ['node_modules/material-design-lite/material.min.css'],
          dest: 'public/css/material.min.css'
        }, {
          src: ['node_modules/sweetalert/lib/sweet-alert.css'],
          dest: 'public/css/sweet-alert.css'
        }]
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      ngIndex: {
        files: [{
          expand: true,
          cwd: 'client/js/index',
          src: ['*.js'],
          dest: 'public/js/index',
          ext: '.js',
          extDot: 'last'
        }]
      }
    },

    concat: {
      ngIndex: {
        src: ['./public/js/index/*.js'],
        dest: './public/js/index.js'
      }
    },

    cssmin: {
      client: {
        files: [{
          expand: true,
          cwd: 'client/css',
          src: ['*.css', '!*.min.css'],
          dest: 'public/css',
          ext: '.min.css'
        }]
      }
    },

    usebanner: {
      client: {
        options: {
          position: 'top',
          banner: '/*\n<%= pkg.name %> v<%= pkg.version %>\nhttps://github.com/SherlockStd/lisk-transparency-reports\n*/\n',
          linebreak: true
        },
        files: {
          src: ['public/js/**/*.js', '!public/js/lib/*.*', 'public/css/*.min.css']
        }
      }
    }

  })

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-ng-annotate')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-banner')

  grunt.registerTask('default', ['clean', 'copy', 'ngAnnotate', 'concat', 'cssmin', 'usebanner'])
  grunt.registerTask('build', ['clean', 'copy', 'ngAnnotate', 'concat', 'cssmin', 'usebanner'])
}
