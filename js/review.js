// Initializes parse
Parse.initialize("H4jsjopclzmBkZr3zfMRk9DrNDJpu6bDDlv6kLE2", "KB49Uq3F77aSQumFlbDjtsd7IREB5yQixXcZQMMY");

// Initializes raty star rating display
$('#rating').raty();

// Initializes Review parse object
var Review = Parse.Object.extend('Review');

// Function when user clicks the subit review button
$('form').submit(function() {
	var review = new Review();
	var userTitle = $("#title");
	var userReview = $("#review");
	
	// Sets user's title, review, ratings, and votes
	review.set("title", userTitle.val());
	review.set("review", userReview.val());	
	review.set("rating", ($("#rating").raty('score')));
	review.set("upVotes", 0);
	review.set("totalVotes", 0);

	// Saves user's input information
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

// Gets user's review information
var getData = function() {
	var query = new Parse.Query(Review);
	query.find({
		success:function(results) {
			buildList(results);
		} 
	})
}

// Emptys list and inputs user's new data
var buildList = function(data) {
	$('ol').empty();
	var totalRatings = 0;
	var totalReviews = 0;

	// Goes through every item on the list and inputs data item
	data.forEach(function(item){
		addItem(item);
		totalRatings += item.get("rating");
		totalReviews += 1;
	});
	$("#averageRating").raty({score: totalRatings/totalReviews, readOnly: true});
}

// Displays user's new data and retrieves previous data
var addItem = function(item) {
	var title = item.get("title");
	var review = item.get("review");
	var rating = item.get("rating");
	var upVotes = item.get("upVotes");
	var totalVotes = item.get("totalVotes");

	// Initializes html elements
	var li = $("<li></li>");
	var reviewsSection = $("<section></section>")
	var userReviews = $("<div class='container' id='userReviews'></div>");
	var userTitle = $("<h4 id='userTitle'></h4>");
	var userReview = $("<h5></h5>");
	var userRating = $("<div id='userRating' class='raty'></div>");
	var deleteRating = $("<button id='deleteRating'><span class='glyphicon glyphicon-remove'></span></button>");
	var upRating = $("<button id='upRating'><span class='glyphicon glyphicon-thumbs-up'></span></button>");
	var downRating = $("<button id='downRating'><span class='glyphicon glyphicon-thumbs-down'></span></button>");
	var statistics = $("<p id='statistics'></p>");

	// Deletes review on click
	deleteRating.click(function() {
		item.destroy({
			success: getData()
		})
	})

	// Upvotes review on click
	upRating.click(function() {
		item.set("totalVotes", totalVotes += 1);
		item.set("upVotes", upVotes += 1);
		item.save();
		getData();
	});

	// Downvotes review on click
	downRating.click(function() {
		item.set("totalVotes", totalVotes += 1);
		item.save();
		getData();
	});

	// Sets individual review's title, review content, rating, and rating statistics
	userRating.raty({score: rating, readOnly: true});
	userTitle.text(title);
	userReview.text(review);
	statistics.text(upVotes + " out of " + totalVotes + " customers found this review helpful.");

	// Appends html elements to list and displays on website
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
