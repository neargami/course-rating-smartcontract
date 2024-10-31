import {Context , PersistentVector} from "near-sdk-as";
import {Rating} from './module';

@nearBindgen
export class RatingContract {
  ratingList : PersistentVector<Rating> = new PersistentVector<Rating>('r');

/**
 * This method stores or updates a rating on the NEAR blockchain.
 * @param rate The course rating value.
 * @param courseId The ID of the course.
 * @param message Optional message for the rating.
 * @returns A success message if the rating was stored or updated.
 */
@mutateState()
  addRating(rate: i32, courseId: string, message: string = ""): string {
    let sender: string = Context.sender;

    // Check if the user has already rated this course
    if (this.hasUserRated(courseId, sender)) {
      // If rated, update the existing rating
      for (let i = 0; i < this.ratingList.length; i++) {
        let rating = this.ratingList[i];
        if (rating.courseId == courseId && rating.sender == sender) {
          rating.rate = <i32>rate;
          rating.message = message;
          this.ratingList.replace(i, rating); // Replace the old value
          return "Rating updated successfully.";
        }
      }
    }

    // If the user hasn't rated this course before, create a new rating
    let instanceRating = new Rating(sender, courseId, rate, message);
    this.ratingList.push(instanceRating);
    return "Rating submitted successfully.";
  }


  /**
   * Function to check if the user has already rated the course.
   * @param courseId The ID of the course.
   * @param sender The user's address.
   * @returns boolean indicating whether the user has already rated the course.
   */
  hasUserRated(courseId: string, sender: string): bool {
    for (let i = 0; i < this.ratingList.length; i++) {
      let rating = this.ratingList[i];
      if (rating.courseId == courseId && rating.sender == sender) {
        return true;
      }
    }
    return false;
  }

   /**
   * 
   * @returns Node information 
   */
   listWrite() : PersistentVector<Rating>{
    return this.ratingList; //Returns a value like this {element_preffix : 'w::' , _lengthKey:'w:len' , _length:1}
  }


  /**
   * Function to allow users to update their rating only once.
   * @param courseId The ID of the course.
   * @param newRate The new rating value.
   * @param newMessage Optional new message for the rating.
   * @returns A success message if the rating was updated, or an error message.
   */
  /*
  @mutateState()
  updateRating(courseId: string, newRate: i32, newMessage: string = ""): string {
    let sender: string = Context.sender;

    for (let i = 0; i < this.ratingList.length; i++) {
      let rating = this.ratingList[i];
      if (rating.courseId == courseId && rating.sender == sender) {
        if (rating.hasUpdated) {
          return "You have already updated your rating. You cannot update it again.";
        }
        // Update the rating
        rating.rate = <i32>newRate;
        rating.message = newMessage;
        rating.hasUpdated = true;  // Mark as updated
        this.ratingList.replace(i, rating); // Replace the old value
        return "Rating updated successfully.";
      }
    }
    return "You have not rated this course yet.";
  }
*/
  /**
   * Function to retrieve all ratings for a specific course.
   * @param courseId The ID of the course.
   * @returns An array of ratings for the specified course.
   */
  convertData(courseId: string): Array<Rating> {
    let data = new Array<Rating>();
    for (let index = 0; index < this.ratingList.length; index++) {
      let rating = this.ratingList[index];
      if (rating.courseId == courseId) {
        data.push(rating); 
      }  
    }
    return data;
  }

  /**
   * Function to calculate the average rating for a specific course.
   * @param courseId The ID of the course.
   * @returns The average rating for the specified course.
   */
  getAverageRating(courseId: string): f64 {
    let ratings = this.convertData(courseId);
    if (ratings.length == 0) {
      return 0.0; 
    }

    let sum: f64 = 0.0;
    for (let i = 0; i < ratings.length; i++) {
      sum += ratings[i].rate;
    }

    let average: f64 = sum / ratings.length;
    return average;
  }

  /**
   * Function to retrieve the rating of a specific user for a specific course.
   * @param courseId The ID of the course.
   * @param sender The account ID of the user.
   * @returns The rating object of the user for the specified course, or a message if no rating is found.
   */
  getUserRatingForCourse(courseId: string, sender: string): Rating | null {
    for (let i = 0; i < this.ratingList.length; i++) {
      let rating = this.ratingList[i];
      if (rating.courseId == courseId && rating.sender == sender) {
        return rating;  // Return the rating object if found
      }
    }
    return null;
  }

}
