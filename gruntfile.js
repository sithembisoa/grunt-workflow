module.exports = function(grunt){

	//project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		//reusable paths
		paths: {
			app: 'app',
			dist: 'dist',
			app_css: '<%= paths.app %>/css',
			app_img: '<%= paths.app %>/images',
			app_js: '<%= paths.app %>/js',
			source_scss: '<%= paths.app %>/src/scss',
			source_js: '<%= paths.app %>/src/js',
			source_bower: '<%= paths.app %>/src/bower',
			dist_css: '<%= paths.dist %>/css',
			dist_js: '<%= paths.dist %>/js',
			dist_img: '<%= paths.dist %>/images'
		},

		sass: {
			dev: {
				options: {
					outputStyle: 'expanded',
					sourceMap: false
				},
				files: {
					'<%= paths.app_css %>/styles.css':'<%= paths.source_scss %>/app.scss'
				}
			},
			build: {
				options: {
					outputStyle: 'compressed',
					sourceMap: false
				},
				files: {
					'<%= paths.dist_css %>/styles.css': '<%= paths.app_css %>/styles.css'
				}
			}
		},

		browserSync: {
			files: {
				src: ['<%= paths.app_css %>/*.css','<%= paths.app_js %>/*.js', '<%= paths.app %>/*.html']
			},
			options: {
				browser: 'chrome',
				server: '<%= paths.app %>',
				watchTask: true
			}
		},

		watch: {
			sass: {
				files: ['<%= paths.source_scss %>/**/*.scss'],
				tasks: ['sass:dev', 'concat:css']
			},

			js: {
				files: ['<%= paths.source_js %>/*.js'],
				tasks: ['jshint']
			}
		},

		jshint: {
			dev: {
				files: {
					src: '<%= paths.source_js %>/*.js'
				}
			},

			options: {
				reporter: require('jshint-stylish')
			}
		},

		bower: {
			dev: {
				dest: '<%= paths.source_bower %>',
				js_dest: '<%= paths.source_bower %>/js',
				css_dest: '<%= paths.source_bower %>/styles'
			}
		},

		concat: {
			css: {
				src: ['<%= paths.app_css %>/styles.css', '<%= paths.source_bower %>/styles/**/*.css'],
				dest: '<%= paths.app_css %>/styles.css'
			}
		},

		uglify: {
			dev: {
				options: {
					beautify: true,
					mangle: false,
					compress: true,

					output: {
        				comments: 'all'
    				}
				},

				src: ['<%= paths.source_js %>/*.js', '<%= paths.source_bower %>/js/**/*.js'],
				dest: '<%= paths.app_js %>/scripts.js'
			},
			build: {
				src: ['<%= paths.source_js %>/*.js', '<%= paths.source_bower %>/js/**/*.js'],
				dest: '<%= paths.dist_js %>/scripts.min.js'
			}
		},

		copy: {
			html: {
				expand: true,
				cwd: '<%= paths.app %>/',
				src: '*.html',
				dest: '<%= paths.dist %>/',
				options: {
					process: function (content, srcpath){
						return content.replace('scripts.js', 'scripts.min.js');
					}
				}
			}
		},

		clean: {
			dist: {
				src: '<%= paths.dist %>'
			}
		},

		imagemin: {
			build: {
				files: [ 
					{
						expand: true,
						cwd: '<%= paths.app_img %>',
						src: '**/*.{ png, jpg, gif, svg, ico}',
						dest: '<%= paths.dist_img %>'
					}
				]
			}
		}

	});
	//Load the plugins
	grunt.loadNpmTasks('grunt-browser-sync');

	//sass
	grunt.loadNpmTasks('grunt-sass');

	//Watch
	grunt.loadNpmTasks('grunt-contrib-watch');

	//JS hint
	grunt.loadNpmTasks('grunt-contrib-jshint');

	//bower
	grunt.loadNpmTasks('grunt-bower');

	//concat
	grunt.loadNpmTasks('grunt-contrib-concat');

	//uglify
	grunt.loadNpmTasks('grunt-contrib-uglify');

	//copy
	grunt.loadNpmTasks('grunt-contrib-copy');

	//clean
	grunt.loadNpmTasks('grunt-contrib-clean');

	//imagemin
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	//create tasks

	//Default task
	grunt.registerTask('default', ['browserSync', 'watch']);

	//Build

	grunt.registerTask('build', ['clean:dist', 'copy', 'imagemin', 'uglify:build', 'concat:css', 'sass:build']);
};