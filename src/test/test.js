const Imutils = require("../Imutils");
const cv = require("opencv4nodejs");

const image = cv.imread("tortilla.jpg");
// ----- Translation ----
const imgDisplaced = Imutils.translate(image,
                                       // X = width / 2 
                                       image.cols / 2,
                                       // Y = height / 2
                                       image.rows / 2);

/*cv.imshow("real", image);
// Result: -> The left upper corner of image should start in the center of the window
cv.imshow("Displaced", imgDisplaced);
console.log("Translation performed, Check the results...!")
cv.waitKey();
cv.destroyAllWindows();

// ----- Rotation ----
const imgRotated = Imutils.rotate(image, 180);

cv.imshow("real", image);
// Result: -> The Image should be horizontally inverted displayed 
cv.imshow("rotated", imgRotated);
console.log("Rotation performed, Check the results...!")
cv.waitKey();
cv.destroyAllWindows();
*/
// ----- Rotation bound ----
const imgRotationBound = Imutils.rotateBound(image, 90);

cv.imshow("real", image);
// Result: -> The Image should be cropped or amplied when the image is rotated
// for 90° width and height switch each other
cv.imshow("rotated bound", imgRotationBound);
console.log("Rotation performed, Check the results...!")
cv.waitKey();
cv.destroyAllWindows();
