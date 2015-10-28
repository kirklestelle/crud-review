Parse.initialize("H4jsjopclzmBkZr3zfMRk9DrNDJpu6bDDlv6kLE2", "KB49Uq3F77aSQumFlbDjtsd7IREB5yQixXcZQMMY");

$('#rating').raty();

var Review = Parse.Object.extend('Review');

$('form').submit(function() {
	var review = new Review();
	var userTitle = $("#title");
	var userReview = $("#review");
	
	review.set("title", userTitle.val());
	review.set("review", userReview.val());	
	review.set("rating", ($("#rating").raty('score')));
	review.set("upVotes", 0);
	review.set("totalVotes", 0);

	review.save(null, {
		success: function() {
			userTitle.val("");
			userReview.val("");
			$("#rating").raty({score: 0});
			getData();
		}
	});
	return false;
})

var getData = function() {
	var query = new Parse.Query(Review);
	query.find({
		success:function(results) {
			buildList(results);
		} 
	})
}

var buildList = function(data) {
	$('ol').empty();
	var totalRatings = 0;
	var totalReviews = 0;

	data.forEach(function(item){
		addItem(item);
		totalRatings += item.get("rating");
		totalReviews += 1;
	});
	$("#averageRating").raty({score: totalRatings/totalReviews, readOnly: true});
}

var addItem = function(item) {
	var title = item.get("title");
	var review = item.get("review");
	var rating = item.get("rating");
	var upVotes = item.get("upVotes");
	var totalVotes = item.get("totalVotes");

	var li = $("<li></li>");
	var reviewsSection = $("<section></section>")
	var userReviews = $("<div class='container' id='userReviews'></div>");
	var userTitle = $("<h4></h4>");
	var userReview = $("<h5></h5>");
	var userRating = $("<div id='userRating' class='raty'></div>");
	var deleteRating = $("<button id='deleteRating'><span class='glyphicon glyphicon-remove'></span></button>");
	var upRating = $("<button id='upRating'><span class='glyphicon glyphicon-thumbs-up'></span></button>");
	var downRating = $("<button id='downRating'><span class='glyphicon glyphicon-thumbs-down'></span></button>");
	var statistics = $("<p id='statistics'></p>");

	deleteRating.click(function() {
		item.destroy({
			success: getData()
		})
	})

	upRating.click(function() {
		item.set("totalVotes", totalVotes += 1);
		item.set("upVotes", upVotes += 1);
		item.save();
		getData();
	});

	downRating.click(function() {
		item.set("totalVotes", totalVotes += 1);
		item.save();
		getData();
	});

	userRating.raty({score: rating, readOnly: true});
	userTitle.text(title);
	userReview.text(review);
	statistics.text(upVotes + " out of " + totalVotes + " customers found this review helpful.");

	userTitle.append(downRating, upRating);
	userReviews.append(userTitle);
	userReviews.append(userRating);	
	userReviews.append(userReview);
	statistics.append(deleteRating);
	userReviews.append(statistics);
	reviewsSection.append(userReviews);
	li.append(reviewsSection);
	$('ol').append(li);
}
getData();
