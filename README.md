# Visual Interface Designed for the Animation of Compartment Models

The program is available [here](https://staujd02.github.io/time_machine/).  It will run in Chrome, Edge, Internet Explorer or Firefox.  Once the program is activated all operations and file storage are on the local computer. It will animate compartment mass and flux data provided by you.  It does not compute or predict data beyond what you provided.
<br>

### Authors: Kimberley Grobien, Joel Stauffer, Beomjin Kim, Douglas Townsend, Stephen Coburn

```
  Department of Computer Science,
  Department of Mathematical Sciences,
  Department of Chemistry, 
  Purdue University Fort Wayne, Fort Wayne, IN.  
```
**Correspondence to: coburn@pfw.edu**

## Table of Contents - Instructions

- [Creating a new Model](#creating-a-new-model)
- [File Format Specifications](#file-format-specifications)
- [Labeling your Compartments](#labeling-your-compartments)
- [Automatic Model Generation](#automatically-generate-a-model)
- [Adjusting the Model](#adjusting-the-model)
- [Flux Arrows](#flux-arrows)
- [How to Specify Model Animation Values](#how-to-specify-model-animation-values)
- [Controlling the Animation](#controlling-the-animation)
- [Scrolling](#scrolling)
- [Saving the Model](#saving-the-model)
- [Exporting Models](#exporting-models)
- [Importing Models](#importing-models)
- [Important Notes](#important-notes)

## Creating a new Model
To create a new model click on `Model Editing` to expand the folder.  Then click on `Edit Mode` to enable editing.  Nothing in the white space can be changed unless `Edit Mode` is checked.  Compartments are created by clicking on `Add Compartment` and then entering the name of the compartment.  You must click on `Add Data Point` every time you want to add a compartment.  
<br>
## File Format Specifications
The input for compartment data is a single page Excel file with time in the first column and compartment masses to the right.  Row 1 contains labels.  The first compartment created on the screen will be associated with the data in column 2; the next compartment with column 3, etc.  
<br>
## Labeling your Compartments
Compartment labels may be entered manually or by checking the `Import Labels` box.  If no data file has been imported, click `Upload Compartment Data` to provide an Excel file with the label information in row 1 as noted above. To change an existing label, click on the compartment, and then enter the new name in the `Comp. Label` field.  
<br>
## Automatically Generate a Model
To save the user time, a model layout can be inferred from the data uploaded by the `Upload Compartment Data` and `Upload Flux Data` processes. To ensure maximum effectiveness, ensure each column of data in the excel upload begins with a text label (i.e. row one should be composed of all the labels for the compartments). A SPECIAL format must be followed for the flux arrows to be generated effectively. The first row of the flux data in excel will be considered the label of "Originating" compartment. The second row of the flux data will be considered the label of the "Destination" compartment. To begin automatic generation, upload the excel data via `Upload Compartment Data`. Then click `Generate Comps.` to generate a compartment for each column of data in the excel document. Currently these compartments are generated in a straight line with equal spacing. Optionally, upload flux data via `Upload Flux Data` and then click `Generate Flux.`. When the `Generate Flux.` operation begins, the system will attempt to locate an existing compartment with a label that matches the "Origination" label and then locate an existing compartment with a label that matches the "Destination" compartment. If both compartments can be located, a flux arrow will automatically be created between the origin compartment and the destination compartment.
<br>
## Adjusting the Model
The compartments can be dragged to any location in the white space.  The size of the compartments can be adjusted using the slider labeled `Size`. Click `Show Indices` to render gray numbers representing the compartments or flux arrows data index. An arrow's index number is rendered at its origin . For instance, if a compartment has a gray '1' digit, that compartment will  correspond to the first compartment column found in the uploaded excel data. This index can be changed by clicking on a compartment, and then entering a new index number into the the field right of `Data Index`.
<br>
## Flux Arrows
Arrows can be added by clicking on `Add Arrow`.  Then click on the From compartment and drag to the To compartment.  Arrows can be added without any flux data.  This will not affect the animation of the compartment circles.  The only effect of omitting the flux data is that the arrows will not change color. The input for flux data is an Excel file with time in the first column and data in the columns to the right.  As with the compartments, the first arrow created on the screen will be associated with column 2; the next arrow with column 3, etc.  
<br>
## How to Specify Model Animation Values
All specifications are under the `Interpretation` folder. Click the `Interpretation` folder to expand it. The user must set the maximum value for compartment mass in the box to the right of `Comp. Maximum`.  A maximum flux value must be entered in the box to the right of `Flux Maximum`. The compartment color at any given time will be based on its percentage of the maximum value.  Therefore, the maximum value does not have to be the exact maximum value of the compartments.  The chosen maximum value applies to all compartments.  If there is a wide variation in compartment masses, the animation could be repeated with different maximum values to visualize large and small compartments. The color of the compartments ranges from white when empty to black when at or above the maximum value. The arrows change in gray scale from lighter to darker as the flux increases. The hue and intensity of the intermediate color can be set by holding the cursor over the bar to the right of `50% Max Color` moving the circle to get the desired result.  The initial color shown in the compartments and the color chooser box represents 50% of the maximum value. 
<br>
## Controlling the Animation
All animation controls are nested under the `Animation` folder. Click `Animation` to expand the folder. To start the animation click on `Start`. If the animation does not start, click the `Reset` button.  The speed can be adjusted by moving the slider labeled `Delay (in ms)`.  Increasing the delay will slow the animation.  Individual steps can be shown by clicking the appropriate time value on the gray bar in the white space label "Progress Bar".  If there is a very large number of data points, the animation could also be shortened by skipping some data points.  Click on `Step Size` and then enter the number of points to increment by.  An entry of 5, would result in every 5th data point (excel row) being utilized. The `reset` button sets the time index of the animation back to start time.
<br>
## Scrolling
A user may scroll or pan using the arrow keys on their keyboard. This allows for compartments larger than current white field to be created. 
<br>
## Saving the Model
Clicking `Save` by Default Storage saves the current model diagram in the browser.  Clicking that Save button after changing the model will over-write the previous file.  Clicking `New Model` allows you to name the model which will be stored in the browser.  The name will be listed below `Default Storage`.  Only the diagram is stored. The data is not stored and must be uploaded each time the program is opened.
## Exporting Models
Clicking on the `Export Models` button will save all models to an external file in your local `Downloads` folder.
## Importing Models
Clicking on `Upload Compartment Models` opens a file explorer so that you can import a saved file.  Importing overwrites all current models so be sure to save and export current work before importing new files.  Uploading the model does not upload the associated data.  The mass and flux data must also be uploaded.  If the animation does not start when clicking the Start button after an upload, click on Reset.
<br>
## Important Notes
If the browser shows a window asking `Prevent page from creating additional dialogue?` close the window. Activating that command will prevent proper functioning of the program.
As indicated above, the first compartment created on the screen is associated with the second column of data in the spread sheet.  Subsequent compartments are associated with the third, fourth columns, etc. Similarly, the first arrow is associated with the second column of flux data, etc. At this time, removing and replacing compartments or arrows may upset that relationship. Therefore, it is essential that the compartments and arrows be added in the same sequence as the data columns. In the current state of affairs, corrections cannot be made. A new model diagram must be created. 