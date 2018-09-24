# Visual Interface Designed for the Animation of Compartment Models

The program is available [here](https://staujd02.github.io/time_machine/).  It will run in Edge, Internet Explorer or Firefox.  Once the program is activated all operations and file storage are on the local computer.
<br>

### Authors: Kimberley Grobien, Joel Stauffer, Beomjin Kim, Douglas Townsend, Stephen Coburn

```
  Deparment of Computer Science,
  Department of Mathematical Sciences,
  Department of Chemistry, 
  Purdue University Fort Wayne, Fort Wayne, IN.  
```
**Correspondence to: coburn@pfw.edu**

## Table of Contents - Instructions

- [Creating a new Model](#creating-a-new-model)
- [File Format Specifications](#file-format-specifications)
- [Labeling your Compartments](#labeling-your-compartments)
- [Adjusting the Model](#adjusting-the-model)
- [How to Specify Model Animation Values](#how-to-specify-model-animation-values)
- [Flux Arrows](#flux-arrows)
- [Controlling the Animation](#controlling-the-animation)
- [Saving the Model](#saving-the-model)
- [Important Note](#notes)

## Creating a new Model
To create a new model click on `Edit`.  Then click on `Edit Mode` to activate the edit process.  Nothing in the white space can be changed unless `Edit Mode` is checked.  Compartments are created by clicking on `Add Data Point` and then clicking on the white space.  You must click on `Add Data Point` every time you want to add a compartment.  
<br>
## File Format Specifications
The input for compartment data is a single page Excel file with time in the first column and compartment masses to the right.  Row 1 contains labels.  The first compartment created on the screen will be associated with the data in column 2; the next compartment with column 3, etc.  
<br>
## Labeling your Compartments
Compartment labels may be entered manually or by checking the `Import Labels` box.  If no data file has been imported, click `Upload Point Data` to provide an Excel file with the label information in row 1 as noted above.  
<br>
## Adjusting the Model
The compartments can be dragged to any location in the white space.  The size of the compartments can be adjusted using the slider labeled `Size`.  The color of the compartments ranges from white when empty to black when at the maximum value.  The hue and intensity of the intermediate color can be set by holding the cursor over the bar to the right of `color` moving the circle to get the desired result.  The color shown in the compartments represents 50% of the maximum value.  
<br>
## How to Specify Model Animation Values
The user must set the maximum value for compartment mass in the box to the right of `Max Value`.  The compartment color at any given time will be based on its percentage of the maximum value.  Therefore, the maximum value does not have to be the exact maximum value of the compartments.  The chosen maximum value applies to all compartments.  If there is a wide variation in compartment masses, the animation could be repeated with different maximum values to visualize large and small compartments.
<br>
## Flux Arrows
Arrows can be added by clicking on `Add Arrow`.  Then click on the From compartment and drag to the To compartment.  Arrows can be added without any flux data.  This will not affect the animation of the compartment circles.  The only effect of omitting the flux data is that the arrows will not change color.  The arrows change in gray scale from lighter to darker as the flux increases.  The input for flux data is an Excel file with time in the first column and data in the columns to the right.  As with the compartments, the first arrow created on the screen will be associated with column 2; the next arrow with column 3, etc.  A maximum flux value must be entered in the box to the right of `Max Flux`.
<br>
## Controlling the Animation
To start the animation click on the green Start button in the white space.  The speed can be adjusted by moving the slider labeled `Delay`.  Increasing the delay will slow the animation.  Individual steps can be shown by clicking the appropriate time value on the gray bar in the white space.  If there is a very large number of data points, the animation could also be shortened by skipping some data points.  Click on `Adjust increment` and then enter the number of points to skip.  An entry of 5, would result in every 5th data point being utilized.  
The `reset` button sets the time index of the animation back to 1.
<br>
## Saving the Model
Clicking `Save` by Default Storage saves the current model diagram in the browser.  Clicking that Save button after changing the model will over-write the previous file.  Clicking `New Plot` allows you to name the model which will be stored in the browser.  The name will be listed below `Default Storage`.  Only the diagram is stored. The data is not stored and must be uploaded each time the program is opened.
<br>
## Notes
If the browser shows a window asking `Prevent page from creating additional dialogue?` click No,  Activating that command will prevent proper functioning of the program.
