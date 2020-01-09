---
title: Adding Component Duplication To Lona
cover: cover.png
author: Volodymyr Klymenko
---

<re-img src="cover.png"></re-img>

As you might know, I’ve decided to proceed with making more contributions to <a href="https://github.com/airbnb/Lona" target="_blank" rel="noopener noreferrer">Lona</a>, and earlier this week I had an opportunity to add a new feature to this app. In this post, I'll give you an overview of my contribution.

## Feature Request
Users often create new components based on the existing ones, and the only way to do it was to go to Finder and copy & paste a component file. So, there was a feature request to add component duplication support to the File Navigator.

First, let’s take a look at the context menu of the file in File Navigator:
<img src="https://i.imgur.com/wqjU2zJ.png" />

My task was to add a new option called “Duplicate As…” to the context menu, and once the option was selected, it should display the Save dialog. After the user typed a file name, selected location for it and pressed “Save”, the program should open a newly created component in the Component Editor.

🔗 <a href="https://github.com/airbnb/Lona/issues/355" target="_blank" rel="noopener noreferrer">Issue description</a>

## Implementation
There is a function `menuForFile`, which creates a context menu, in the `FileNavigator` class, and that’s the place, where I needed to place my new code:
```swift
// Check if selected file has a ".component" extension
if NSURL(fileURLWithPath: path).pathExtension == "component" {
    menu.addItem(NSMenuItem(title: "Duplicate As...", onClick: {
        var saveURL: String
        // Show Save Dialog
        let dialog = NSSavePanel()
        dialog.title = "Save .component file"
        dialog.showsResizeIndicator = true
        dialog.showsHiddenFiles = false
        dialog.canCreateDirectories = true
        dialog.allowedFileTypes = ["component"]
        dialog.directoryURL = URL(fileURLWithPath: path).deletingLastPathComponent()
        // User canceled the save. Don't swap out the document.
        if dialog.runModal() != NSApplication.ModalResponse.OK {
            return
        }
        guard let url = dialog.url else { return }
        saveURL = url.path
// Try to copy file. If successful, open the file in the Component Editor. Otherwise, display an alert with an appropriate message.
        do {
             try FileManager.default.copyItem(atPath: path, toPath: saveURL)
        } catch {
             let alert = NSAlert()
             alert.messageText = "Couldn't copy component to \(saveURL)"
             alert.addButton(withTitle: "OK")
             alert.runModal()
             return
        }
        self.onAction?(saveURL)
    }))
}
```

## Result
<img src="https://i.imgur.com/Voq2HXd.gif" />

🔗 <a href="https://github.com/airbnb/Lona/pull/359" target="_blank" rel="noopener noreferrer">Pull request</a>
