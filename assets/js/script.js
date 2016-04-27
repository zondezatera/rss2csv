jQuery(document).ready(function() {
		jQuery('#export_csv').click(function (e) {
			var feed_url  = jQuery("#rss_url").val();
			if (feed_url.length == 0) {
				return alert('Input RSS url');
			}
			jQuery.ajax({
				url      : 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(feed_url),
				dataType : 'json',
				success  : function (data) {
					if (data.responseData.feed && data.responseData.feed.entries) {
							 	var array_content = [];
								jQuery.each(data.responseData.feed.entries, function (index, data_set) {
									var array_data = [];
									var array_title = [];
									jQuery.each(data_set,function (index_key, data_output) {
										if (index == 0) {
											array_title.push(index_key);
										}
										data_output = data_output.toString();
										data_output = data_output.replace(/<(?:.|\n)*?>/gm,'');
										data_output = data_output.replace(/(\r\n|\n|\r|,)/gm,'');
										array_data.push(data_output);
									});
									if (index == 0) {
										array_content.push(array_title);
									}
									array_content.push(array_data);
								});
								console.log(array_content);
								var csvContent = "data:text/csv;charset=utf-8,";
								array_content.forEach(function(infoArray, index){
										 dataString = infoArray.join(",");
										 if (index < array_content.length) {
											csvContent += dataString+ "\n";
										 } else{
											csvContent += dataString;
										 }
								});
								var encodedUri = encodeURI(csvContent);
								window.open(encodedUri);
					}
				}
			});
		});
});