# filetype-color package

##Description
This package makes it possible to modify the colors of file names in the side bar and the panes.

When enabled it will add an extra class according to the file extension, for example:

* ".js" files get "filetype-color-js"
* ".jpg" files get "filetype-color-jpg"
* ".php" files get "filetype-color-php"

There are already some predefined colors, but if you want to override or add colors you can do it in your own "styles.less" file.
An example could be:

.filetype-color-js
{
    color: #90c276;
}

##Usage
Toggle on and off with **ctrl-alt-cmd-b**

##Screenshot
![Screenshot](https://github.com/sommerper/filetype-color/raw/master/filetype-color.gif)

##Disclaimer
Since I don't code in coffeescript and the Atom API docs still leave a lot to be desired I couldn't see if there are any events fired when content changes in the tree and pane view.
Until I figure that out, this package will be using the MutationObserver to listen for DOM changes. Probably a less desireable solution as it creates uneeded overhead and leaves me with no other choice but to set some timeouts before applying the colors.
Any insight to how it may be optimized is appreciated.
