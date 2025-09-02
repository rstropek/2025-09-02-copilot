Create a component that encapsulates a slider. Inputs:

* label
* min value
* max value
* step

Add a css file for the module so that I can control the visual representation.

---

Now create a second component in #file:slider.tsx . It should contain 5 sliders:

* J0 (yaw): 0-360, default 0
* J1 (pitch): 0-90, default 75
* J2 (pitch): 0-90, default 45
* J3 (pitch): 0-90, default 15
* J4 (pitch): 0-90, default 10

It must make the current values of the sliders accessible for the user of the component

---

Take a look at #file:page.tsx . It contains a visualization of a robot arm and sliders. Change the implementation of the robot arm so that the axis can be controlled by moving the sliders.

---

I want to be able to move the camera in #file:arm.tsx using the mouse. It should move on a sphere around the robot arm.

---

This next.js 15 app displays a robot arm. It can already be moved with sliders. I want to have an additional select box where I can choose one of the following colors:

* red
* blue
* green
* black
* white

The material of the robot should change accordingly.

---

I want to support dark and light mode in my app. Add a switcher on the right upper corner of my main page.
