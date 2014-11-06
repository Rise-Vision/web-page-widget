# Web Page Widget

## Introduction
The Web Page Widget is used to display other web pages inside of a Presentation.

### How It Works
The Web Page Widget displays the web page inside of an `iframe`. The page can be shifted by setting the *Horizontal Scroll* and *Vertical Scroll* values. This functions in the same way as a scrollbar does on a regular web page, allowing the Widget to display only a specific region.

The Widget also provides an option to scale (zoom) the content of the iframe within a range of 50-200%, and it can enable or disable user interactivity with the content.

Web Page Widget refreshes the page as per the *Data Refresh Interval*. To prevent it from displaying a cached copy, a dummy variable is appended to the URL with every update, forcing the Widget to show the most recent version of the page.

### Known Issues
Certain URLs contain scripts which redirect the parent page of the browser to their site. This is a security measure against those pages being included in an iframe. When a page such as this is loaded into the Web Page Widget, the Viewer will be redirected to that site, rendering the Display inoperable.

Other particular URLs might configure their server to make use of the X-Frame-Options response header which can be used to indicate whether or not a browser should be allowed to render a page in an `iframe`. Sites use this to avoid clickjacking attacks, by ensuring that their content is not embedded into other sites. When a page such as this is loaded in the Web Page Widget, the site will not be displayed.

Web Page Widget works in conjunction with [Rise Vision](http://www.risevision.com), the [digital signage management application](http://rva.risevision.com/) that runs on [Google Cloud](https://cloud.google.com).

At this time Chrome is the only browser that this project and Rise Vision supports.

## Development

### Local Development Environment Setup and Installation
The Widget can be installed by executing the following command: `git clone https://github.com/Rise-Vision/widget-web-page.git`

## Submitting Issues
If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas please post your thoughts to our [community](http://community.risevision.com), otherwise submit a pull request and we will do our best to incorporate it.

### Languages
If you would like to translate the user interface for this product to another language please complete the following:
- Download the English translation file from this repository.
- Download and install POEdit. This is software that you can use to write translations into another language.
- Open the translation file in the [POEdit](http://www.poedit.net/) program and set the language for which you are writing a translation.
- In the Source text window, you will see the English word or phrase to be translated. You can provide a translation for it in the Translation window.
- When the translation is complete, save it with a .po extension and email the file to support@risevision.com. Please be sure to indicate the Widget or app the translation file is for, as well as the language that it has been translated into, and we will integrate it after the translation has been verified.

## Resources
If you have any questions or problems please don't hesitate to join our lively and responsive community at http://community.risevision.com.

If you are looking for user documentation on Rise Vision please see http://www.risevision.com/help/users/

If you would like more information on developing applications for Rise Vision please visit http://www.risevision.com/help/developers/.

**Facilitator**

[Stuart Lees](https://github.com/stulees "Stuart Lees")
