# NOTICE

This project will no longer function. It was built on the assumption that the Kindle would be mounted as a USB Mass Storage Device, where the app could access the Kindle's filesystem directly. However, modern versions of Android don't support this mounting method.

# Bookshelf to Kindle

A simple app built for the express purpose of moving eBooks from [Deseret Book's Bookshelf App][1] to your Kindle's native eBook collection.

## Why?

I dislike Bookshelf. Compared to the Kindle's native reading interface, it's ugly and sluggish. I discovered that it was possible to read Bookshelf books on with the Kindle reader, but it's kind of a tedious process to move them to the Kindle library. This app makes it easy.

## How do I use it?

1. Install [Calibre][2]. Make sure that `ebook-convert` is in your PATH. 

> This step is only required if you want books to show up under 'Books' on your Kindle, instead of 'Docs'.

1. Plug in your Kindle.
2. Copy the `com.deseretbook.bookshelf` folder from the Kindle, to your Desktop folder. The bookshelf folder is usually found inside `Android/`.
3. Start the app. It should automatically load your accounts.
4. Select your Bookshelf account from the dropdown.
5. Click the `Transfer` button on the books you'd like to move. 
6. Once the transfers are complete, open the folder with your email address inside the `com.deseretbook.bookshelf` folder on your desktop.
7. Inside of your account folder, (named using your email address) you will find a `converted-books` folder. This folder contains the converted books that need to be copied back to your Kindle.
8. Copy the books you want to place on your Kindle from `converted-books` to the `Books` folder on your Kindle.

## Internals

Bookshelf to Kindle uses [KindleGen][3] to do the initial conversion of the Bookshelf books. This ensures the best compatibility with the Kindle reader.

Once KindleGen has finished, it uses Calibre's `ebook-convert` tool to compress the book, and strip the PDOC tag, which allows it to show up in Books on your Kindle.

Built with [Angular][4] and [Node][5], Desktop app via [Node-Webkit][6].

[1]: http://deseretbook.com/bookshelf
[2]: http://calibre-ebook.com/
[3]: http://www.amazon.com/gp/feature.html?docId=1000765211
[4]: https://angularjs.org/
[5]: http://nodejs.org/
[6]: https://github.com/rogerwang/node-webkit


