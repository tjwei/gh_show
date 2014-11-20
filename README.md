gh_show
=======
## Remote presentation with Google Hangouts
[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/ZEZQjnoG2hw/0.jpg)](http://www.youtube.com/watch?v=ZEZQjnoG2hw)

## Install
Follow https://developers.google.com/+/hangouts/getting-started 
but set the URL of the  XML file as:
https://raw.githubusercontent.com/tjwei/gh_show/master/HangoutShow.xml
and choose the project to be an Extension instead of an APP.


## Try
Launch a Google hangout video chat 
(you can use this page https://plus.google.com/hangouts/active)
and select you extension.
When the focus is on the black div, then you can use your arrow keys to control the slides.
'[' and ']' keys change the size of slide image.

## Create your own slides
The slides is in JSON format, you need to convert your slides into jpg or png files.
slides2png.ipynb demostrate how to use python and spynner to convert reveal.js slides into png files.
(the original slides can be found  at http://b81.org/s/pyconcn_zhs.html
or  https://drive.google.com/open?id=0B67hU53wKsamLTNqdG96VjRlaXc&authuser=0 in PDF format)

Paste the base url, banner file name, and the slide JSON into slide data textarea, and then press "load slides" button.

## Leap motion
You need to calibrate the camera first.
See LeapCalibrate.ipynb to find out the details.
Basicly you need the Camera matrix, p1, p2, k1, k2, k3, tvec, rvec. 
The default paramter works for the iSight HD Camera (1280x720) of my MacBookAir 2012 11",
when the leap motion is positioned immediately infront of the touch pad and when the LCD angles about 60 degree.
Scroll down and press the "set camera"
Use pinch action will grab the image and let you move and resize the image.
Use the sizelock  button at top to toggle whether leap motion gestures will change the size of images.

