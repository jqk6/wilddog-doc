var path = require('path'),
	fs = require('fs'),
	glob = require('glob'),
	_ = require('underscore'),
	_s = require('underscore.string'),
	marked = require('./marked'),
	lunr = require('lunr');
var idx=null;
var raneto = {

	metaRegex: /^\/\*([\s\S]*?)\*\//i,

	cleanString: function(str, underscore){
		var u = underscore || false;
		if(u){
			return _s.underscored(str);
		} else {
			return _s.dasherize(str);
		}
	},

	processMeta: function(markdownContent) {
		var metaArr = markdownContent.match(raneto.metaRegex),
			meta = {};

		var metaString = metaArr ? metaArr[1].trim() : '';
		if(metaString){
			var metas = metaString.match(/(.*): (.*)/ig);
			metas.forEach(function(item){
				var parts = item.split(': ');
				if(parts[0] && parts[1]){
					meta[raneto.cleanString(parts[0].trim(), true)] = parts[1].trim();
				}
			});
		}

		return meta;
	},

	stripMeta: function(markdownContent) {
		return markdownContent.replace(raneto.metaRegex, '').trim();
	},

	processVars: function(markdownContent, config) {
		if(typeof config.base_url !== 'undefined') markdownContent = markdownContent.replace(/\%base_url\%/g, config.base_url);
		return markdownContent;
	},

    /**
    *  获得一个页面.如果出现index.md,那么就显示index.md
    **/
	getPage: function(path, config) {
		try {
			var file = fs.readFileSync(path),
				slug = path.replace(__dirname +'/content/', '').trim();

			if(slug.indexOf('index.md') > -1){
				slug = slug.replace('index.md', '');
			}
			slug = slug.replace('.md', '').trim();

			var meta = raneto.processMeta(file.toString('utf-8')),
				content = raneto.stripMeta(file.toString('utf-8'));
			content = raneto.processVars(content, config);
			var html = marked(content);

			return {
				'slug': slug,
				'title': meta.title ? meta.title : 'Untitled',
				'body': html,
				'excerpt': _s.prune(_s.stripTags(_s.unescapeHTML(html)), config.excerpt_length)
			};
		}
		catch(e){}
		return null;
	},

    /**
    * 获得页面列表
    */

    getPages: function(activeSlug,config) {
    	// body...

    	var subDir=function(currentDir,level){
    		var filesProcessed=[];
    		var category_sort = config.category_sort || false;
    		var files = glob.sync(currentDir+"/*");
    		var filesProcessed=[];
    		var parentTitle=null;
    		var parentSlug=null;
			files.forEach(function(filePath){
				var shortPath = filePath.replace(__dirname +'/content/', '').trim(),
				stat = fs.lstatSync(filePath);
				if(stat.isDirectory()){
				var sort = 0;
				if(category_sort){
					try {
						var sortFile = fs.readFileSync(__dirname +'/content/'+ shortPath +'/sort');
						sort = parseInt(sortFile.toString('utf-8'), 10);
					}
					catch(e){
						console.log(e);
					}
				}


				var subRes=subDir(filePath,level+1)
				var subfiles=subRes.files;
				var dirTitle=subRes.parentTitle;
				var dirSlug=subRes.parentSlug;
				var dirObj={
					is_dir:true,
					slug: dirSlug?dirSlug:shortPath,
					path: filePath,
					title: dirTitle?dirTitle:_s.titleize(_s.humanize(path.basename(shortPath))),
					is_index: false,
					class: 'category-'+ (level+1),
					sort: sort+1000,
					active:(activeSlug.trim().indexOf( '/'+ shortPath)==0),
					files:subfiles 
				};
				filesProcessed.push(dirObj);
				
			}
			else if(stat.isFile()&& path.extname(shortPath) == '.md'){
					var file = fs.readFileSync(filePath),
						slug = shortPath,
						pageSort = 0;
                    var  isIndex=false;
					if(shortPath.indexOf('index.md') > -1){
						slug = slug.replace('index.md', '');

                        isIndex=true;
					}
					slug = slug.replace('.md', '').trim();

					var dir = path.dirname(shortPath),
						meta = raneto.processMeta(file.toString('utf-8'));
					var page_sort_meta=config.page_sort_meta;
					if(page_sort_meta && meta[page_sort_meta]) pageSort = parseInt(meta[page_sort_meta], 10);
					if(isIndex){
						parentTitle=meta.title;
					}
					else{
					filesProcessed.push({
						is_md:true,
						is_index:isIndex,
						slug:slug,
						title:meta.title ? meta.title : 'Untitled',
						active: (activeSlug.trim().indexOf( '/'+ slug)==0),
						sort: pageSort
					});
				}
                   
				}
			});  
			filesProcessed=_.sortBy(filesProcessed, function(file){ return file.sort; });
			if(filesProcessed.length>0){
				parentSlug=filesProcessed[0].slug;
			}
			return {"files":filesProcessed,"parentSlug":parentSlug,"parentTitle":parentTitle}
    	}

    	return subDir(__dirname+"/content",0,activeSlug).files;
    	

    },

	search: function(query) {
		if(idx == null){
		var files = glob.sync(__dirname +'/content/**/*.md');
		idx = lunr(function(){
			this.field('title', { boost: 10 });
			this.field('body');
		});

		files.forEach(function(filePath){
			try {
				//skip index
				if(filePath.indexOf("index.md")>=0){
					return;
				};
				var shortPath = filePath.replace(__dirname +'/content/', '').trim(),
					file = fs.readFileSync(filePath);

				var meta = raneto.processMeta(file.toString('utf-8'));
				idx.add({
					'id': shortPath,
					'title': meta.title ? meta.title : 'Untitled',
					'body': file.toString('utf-8')
				});
			}
			catch(e){}
		});
		}
		return idx.search(query);
	}

};

module.exports = raneto;
