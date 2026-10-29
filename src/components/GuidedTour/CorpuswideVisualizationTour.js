import { useEffect, useRef } from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";
import { hideTour, showTour } from "./tourHide";

const TOUR_KEY = "kitab-corpuswide-tour-seen";

// Main book used when the tour is started from another page
// (al-Iṣṭakhrī's Masālik: reused by many later texts)
const DEMO_BOOKS = "Shamela0011680-ara1.mARkdown_all";

const MS_STEP_TITLE = "Milestone totals";
const TEXT_STEP_TITLE = "Read the milestone";
const BAR_STEP_TITLE = "Overview per book";
const HOVER_STEP_TITLE = "Hover over a dot";
const DOT_STEP_TITLE = "Arrow navigation";
const OPEN_STEP_TITLE = "Open the DiffViewer";
const DIFF_STEP_TITLE = "The DiffViewer";
const FILTER_STEP_TITLE = "Filters and settings";
const DOWNLOAD_STEP_TITLE = "Download the chart";

const steps = [
  {
    title: "Corpus-wide Text Reuse Visualisation",
    intro:
      "This visualisation shows which passages of one text, the <b>main book</b>, are reused in all the other texts of the corpus, and where.",
  },
  {
    element: "#scatterChart",
    title: "The scatter plot",
    intro:
      "Each <b>dot</b> is an alignment: a passage that a milestone of the main book (vertical axis) shares with a milestone of another text (horizontal axis).",
    position: "right",
  },
  {
    element: "#scatterChart .yAxis",
    title: "The Y axis: the main book",
    intro:
      "The main book is represented by a series of dots on the Y axis; each dot represents a 300-word chunk of the text (the <b>milestone</b>). The beginning of the book is at the top, the end at the bottom.",
    position: "right",
  },
  {
    element: "#scatterChart .xAxis",
    title: "The X axis: the other texts",
    intro:
      "Each other text in the corpus that shares text with the main book is aligned chronologically along the X axis (earliest book on the left, latest on the right).",
    position: "top",
  },
  {
    element: "#scatter-legend",
    title: "Colour legend",
    intro:
      "The colour of a dot shows how many characters the two milestones share. The darker, the more characters they share.",
    position: "bottom",
  },
  {
    // The hover is simulated by the tour (see below). The target is a transparent box
    // that the tour places over the plot area between the two axes.
    element: "#tour-plot-area",
    title: HOVER_STEP_TITLE,
    intro:
      "Hovering over a dot identifies where the reused passage is found in both books.",
    position: "auto",
  },
  {
    element: "#multiVis",
    title: DOT_STEP_TITLE,
    intro:
      "<b>Clicking</b> a dot selects it and enables arrow navigation: press the <b>left/right</b> arrow keys to move to the previous/next reuse passage of the same milestone, and the <b>up/down</b> arrow keys to move to the previous/next reuse passage in the same book. <br>Watch the selection move: right, down, left and up.",
    position: "auto",
  },
  {
    element: "#multiVis",
    title: OPEN_STEP_TITLE,
    intro:
      "<b>Double-clicking</b> a dot or pressing <b>Enter</b> will show the exact text of both passages. <br>Click <b>Next</b> to scroll to the DiffViewer at the bottom.",
    position: "auto",
  },
  {
    // opened dynamically (see below)
    element: "#bookSectionRef",
    title: DIFF_STEP_TITLE,
    intro:
      "Text that only occurs in the left passage is highlighted in blue, text that only occurs in the right passage in green, and text that occurs in both but at a different place in orange. <br>Tip: click <i>load context</i> on either side to check whether the alignment continues over a milestone boundary.",
    position: "auto",
  },
  {
    element: "#scatterChart",
    title: "Reading the patterns",
    intro:
      "<b>Horizontal rows</b> of dots are passages of the main book that were reused in many texts. <br><b>Dense columns</b> are texts that borrow heavily from the main book. <br><b>Empty bands</b> are parts of the main book that were hardly reused.",
    position: "right",
  },
  {
    // (the tooltip is raised above intro.js's overlay: see below)
    element: "#side-bar",
    title: MS_STEP_TITLE,
    intro:
      "The bar chart on the right sums up each milestone of the main book: the number of alignments it has with other texts (or the number of characters matched, see the filter settings). <br>Click a bar to select a milestone: its row of dots is outlined in the scatter plot. Use the <b>up/down</b> arrow keys to move to other milestones and <b>Escape</b> to deselect.",
    position: "auto",
  },
  {
    // The text panel does not exist until it is opened: it is opened dynamically
    // (see below) and the tour is restarted at this step to find it.
    element: "#milestone-text-panel",
    title: TEXT_STEP_TITLE,
    intro:
      "With a milestone selected, press <b>Enter</b> to read its text below the charts. <br>Select a passage in the text and click <b>Filter to selection</b> to limit the scatter plot to the alignments that overlap with your selection.",
    position: "auto",
  },
  {
    element: "#bottom-bar",
    title: BAR_STEP_TITLE,
    intro:
      "The bar chart at the bottom sums up each of the other texts: how much of it is aligned with the main book. Click a bar to select a text: its column of dots is outlined in the scatter plot. <br>Use the <b>left/right</b> arrow keys to move to other texts. Double-click a bar (or press <b>Enter</b>) to open the pairwise visualisation of the two texts in a new tab.",
    position: "auto",
  },
  {
    // the filter panel, opened dynamically (see below)
    element: "#multi-filter-panel",
    title: FILTER_STEP_TITLE,
    intro:
      "The <b>cog button</b> opens the filters and settings: limit the chart to a range of dates, milestones, aligned characters or alignments per text, show only the texts that overlap with the selected milestones, and choose whether the bar charts count alignments or characters. <br>If the main book has a table of contents, a panel on the right lets you limit the chart to chosen sections.",
    position: "bottom",
  },
  {
    element: "#viz-reset-btn",
    title: "Reset",
    intro: "Restore the full chart: remove all filters and selections.",
    position: "bottom",
  },
  {
    // the toolbar with the download button plus the options panel, which is shown
    // dynamically (see below)
    element: "#multi-viz-header",
    title: DOWNLOAD_STEP_TITLE,
    intro:
      "The <b>download button</b> opens the download options: download the chart as an image, with or without the legend, the side bar, the bottom bar and the URL.",
    position: "bottom",
  },
  {
    element: "#viz-help-link",
    title: "More information",
    intro: "Click this icon to read more about this visualisation.",
    position: "bottom",
  },
  {
    element: "#take-viz-tour-btn",
    title: "That's it!",
    intro: "You can revisit this tour at any time by clicking this button.",
    position: "bottom",
  },
];

// what the tour selects (so that the tooltip persists) in a step, and the hint
// that the persistent tooltip of that kind of selection contains
const SELECTION_KIND = {
  [MS_STEP_TITLE]: "ms",
  [TEXT_STEP_TITLE]: "ms",
  [BAR_STEP_TITLE]: "bar",
  [HOVER_STEP_TITLE]: "hover",
  [DOT_STEP_TITLE]: "dot",
  [OPEN_STEP_TITLE]: "dot",
  [DIFF_STEP_TITLE]: "dot",
};
const SELECTION_HINT = {
  ms: "Enter to view text",
  bar: "Press Enter for pairwise",
  dot: "Press Enter to compare",
  hover: "Double-click to compare aligned texts",
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// resolve once condition() returns something truthy (or after timeout ms)
const waitFor = async (condition, timeout = 8000) => {
  const start = Date.now();
  while (!condition() && Date.now() - start < timeout) {
    await wait(100);
  }
};

const click = (node) =>
  node?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

const pressKey = (key) =>
  document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));

// is a selection of this kind shown in the (persistent) tooltip?
const isSelected = (kind) => {
  const tooltip = document.querySelector(".vizTooltip");
  return (
    !!tooltip &&
    parseFloat(getComputedStyle(tooltip).opacity) > 0.5 &&
    (tooltip.textContent ?? "").includes(SELECTION_HINT[kind])
  );
};

// index of the element with the largest numeric attribute
const indexOfMax = (nodes, attr) => {
  let best = 0;
  let bestValue = -Infinity;
  nodes.forEach((node, i) => {
    const value = parseFloat(node.getAttribute(attr)) || 0;
    if (value > bestValue) {
      bestValue = value;
      best = i;
    }
  });
  return best;
};

// Select something as if the user had clicked it:
// * ms: the milestone with the most alignments (widest bar of the side bar)
// * bar: the text with the most aligned material (tallest bar of the bottom bar)
// * dot: the dot with the most matched characters
const select = (kind) => {
  if (kind === "ms") {
    const hits = [...document.querySelectorAll("#side-bar .bar-hit")];
    const bars = [...document.querySelectorAll("#side-bar .bar")];
    click(hits[indexOfMax(bars, "width")]);
  } else if (kind === "bar") {
    const hits = [...document.querySelectorAll("#bottom-bar .bar-hit")];
    const bars = [...document.querySelectorAll("#bottom-bar .bar")];
    click(hits[indexOfMax(bars, "height")]);
  } else if (kind === "dot" || kind === "hover") {
    // (the dots of the main book itself are not clickable: their cursor is not a pointer)
    const dots = [...document.querySelectorAll("#scatterChart circle.dot")].filter(
      (dot) => dot.style.cursor === "pointer"
    );
    let best = null;
    dots.forEach((dot) => {
      if (!best || (dot.__data__?.ch_match ?? 0) > (best.__data__?.ch_match ?? 0)) best = dot;
    });
    if (kind === "dot") {
      click(best);
    } else if (best) {
      // hover: the tooltip is placed at the pointer position
      const rect = best.getBoundingClientRect();
      hoveredDot = best;
      best.dispatchEvent(
        new MouseEvent("mouseover", {
          bubbles: true,
          cancelable: true,
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
        })
      );
    }
  }
};

// the dot over which the tour simulated a mouse pointer
let hoveredDot = null;
const unhover = () => {
  hoveredDot?.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, cancelable: true }));
  hoveredDot = null;
};

const deselect = () => pressKey("Escape");

// Open the milestone text panel (Enter on a selected milestone)
const openTextPanel = async () => {
  if (!isSelected("ms")) {
    select("ms");
    await wait(300);
  }
  pressKey("Enter");
  await waitFor(() => document.getElementById("milestone-text-panel"), 15000);
  await wait(1500); // the text loads, and the page scrolls to the panel
};

// Open the DiffViewer (Enter on a selected dot)
const openDiffViewer = async () => {
  if (!isSelected("dot")) {
    select("dot");
    await wait(300);
  }
  pressKey("Enter");
  await waitFor(() => document.querySelector("#bookSectionRef .diffTableCell"), 30000);
  await wait(1800); // the page scrolls smoothly to the DiffViewer
};

const DYNAMIC_STEPS = {
  [TEXT_STEP_TITLE]: openTextPanel,
  [DIFF_STEP_TITLE]: openDiffViewer,
};

// A transparent box over the plot area between the two axes of the scatter plot,
// so that the "hover" step can highlight exactly that area (the tooltip is raised above
// the overlay separately).
const PLOT_AREA_ID = "tour-plot-area";
const positionPlotArea = () => {
  const chartBox = document.getElementById("chartBox");
  const yAxis = document.querySelector("#scatterChart .yAxis .domain")?.getBoundingClientRect();
  const xAxis = document.querySelector("#scatterChart .xAxis .domain")?.getBoundingClientRect();
  if (!chartBox || !yAxis || !xAxis) return;
  let box = document.getElementById(PLOT_AREA_ID);
  if (!box) {
    box = document.createElement("div");
    box.id = PLOT_AREA_ID;
    box.style.position = "absolute";
    box.style.pointerEvents = "none";
    chartBox.appendChild(box);
  }
  const outer = chartBox.getBoundingClientRect();
  box.style.left = `${yAxis.right - outer.left}px`;
  box.style.top = `${yAxis.top - outer.top}px`;
  box.style.width = `${Math.max(xAxis.right - yAxis.right, 0)}px`;
  box.style.height = `${Math.max(xAxis.top - yAxis.top, 0)}px`;
};
const removePlotArea = () => document.getElementById(PLOT_AREA_ID)?.remove();

// The tooltip of the charts is not inside the element that a step highlights, so it
// would stay below intro.js's overlay: raise it above it (but below the step's popup).
const raiseTooltip = (raised) => {
  const tooltip = document.querySelector(".vizTooltip");
  if (tooltip) tooltip.style.zIndex = raised ? "99999999" : "";
};

const CorpuswideVisualizationTour = ({ run, onExit }) => {
  const introRef = useRef(null);

  useEffect(() => {
    if (!run) return;

    // Skip steps whose target element is not in the DOM. The elements that the tour
    // creates itself (text panel, DiffViewer) are always included.
    positionPlotArea();
    raiseTooltip(true);
    const availableSteps = steps.filter(
      (step) =>
        !step.element ||
        step.element === "#milestone-text-panel" ||
        step.element === "#bookSectionRef" ||
        document.querySelector(step.element)
    );

    // Track what the tour has opened, so that it can be undone.
    let tourTextOpen = false;
    let tourFilterOpen = false;
    let tourDownloadOpen = false;
    let tourSelected = false;
    let currentKind = null; // the kind of selection of the current step
    let stepToken = 0; // changes whenever the step changes
    let launching = false; // a restarted tour is on its way to the wanted step
    let dynamicReady = false; // the panel of a dynamic step is open (tour restarted)
    let currentTitle = null;

    const closeTextPanel = () => {
      if (!tourTextOpen) return;
      tourTextOpen = false;
      document.getElementById("milestone-text-close")?.click();
    };
    const closeFilterPanel = () => {
      if (!tourFilterOpen) return;
      tourFilterOpen = false;
      document.getElementById("viz-filter-btn")?.click();
    };
    const closeDownloadOptions = () => {
      if (!tourDownloadOpen) return;
      tourDownloadOpen = false;
      document.getElementById("viz-download-btn")?.click();
    };

    const cleanUp = () => {
      unhover();
      closeTextPanel();
      closeFilterPanel();
      closeDownloadOptions();
      if (tourSelected) {
        tourSelected = false;
        deselect();
      }
    };

    const handleDone = () => {
      cleanUp();
      showTour();
      removePlotArea();
      raiseTooltip(false);
      localStorage.setItem(TOUR_KEY, "true");
      onExit?.();
    };

    // Replace the running tour by a new one starting at step `index` (0-based), so that
    // the step elements are looked up again. The replaced tour's handlers are ignored.
    const restartAt = async (index) => {
      const oldTour = introRef.current;
      introRef.current = null;
      hideTour();
      await oldTour?.exit(true);
      launch(index + 1);
    };

    const launch = (startAt) => {
      const tour = introJs
        .tour()
        .setOptions({
          steps: availableSteps,
          showProgress: false,
          showBullets: true,
          exitOnOverlayClick: false,
          scrollToElement: true,
          disableInteraction: false,
          nextLabel: "Next",
          prevLabel: "Back",
          doneLabel: "Done",
        })
        .onComplete(() => {
          if (tour === introRef.current) handleDone(); // ignore a replaced tour
        })
        .onExit(() => {
          if (tour === introRef.current) handleDone();
        });
      introRef.current = tour;

      // Returning a Promise lets the page finish rendering before intro.js highlights.
      tour.onBeforeChange(function (targetElement, currentStep) {
        if (launching) return; // restarting: nothing to undo or open
        const title = availableSteps[currentStep]?.title;
        currentKind = SELECTION_KIND[title] ?? null;
        currentTitle = title;
        stepToken += 1;

        // steps without a selection of their own: deselect what an earlier step selected
        if (!currentKind && tourSelected) {
          tourSelected = false;
          deselect();
        }
        if (title === HOVER_STEP_TITLE) positionPlotArea();

        // undo what an earlier step opened
        let closed = false;
        if (title !== TEXT_STEP_TITLE && tourTextOpen) { closeTextPanel(); closed = true; }
        if (title !== FILTER_STEP_TITLE && tourFilterOpen) { closeFilterPanel(); closed = true; }
        if (title !== DOWNLOAD_STEP_TITLE && tourDownloadOpen) { closeDownloadOptions(); closed = true; }

        if (title !== HOVER_STEP_TITLE && hoveredDot) unhover();

        const open = DYNAMIC_STEPS[title];
        if (!open) dynamicReady = false;

        if (open) {
          if (dynamicReady) return; // restarted tour: the target now exists
          return (async () => {
            hideTour(); // no popup that jumps around while the page scrolls
            if (closed) await wait(400);
            await open();
            if (title === TEXT_STEP_TITLE) tourTextOpen = true;
            tourSelected = true;
            // The target did not exist when this tour started, so intro.js gave the
            // step a floating placeholder. Restart the tour at this step so that
            // its element is looked up again.
            dynamicReady = true;
            await restartAt(currentStep);
            return false; // abandon the change in the tour that was just exited
          })();
        }

        if (title === FILTER_STEP_TITLE) {
          if (tourFilterOpen) return;
          tourFilterOpen = true;
          document.getElementById("viz-filter-btn")?.click();
          return wait(450).then(() => introRef.current?.refresh());
        }

        if (title === DOWNLOAD_STEP_TITLE) {
          if (tourDownloadOpen) return;
          tourDownloadOpen = true;
          document.getElementById("viz-download-btn")?.click();
          return wait(450).then(() => introRef.current?.refresh());
        }

        if (closed) return wait(400);
      });

      tour.onAfterChange(function () {
        if (!currentKind) return;
        // Select (once the step is laid out); if the chart redraws and drops the
        // selection, select again.
        const kind = currentKind;
        const token = stepToken;
        const attempt = (attemptsLeft) => {
          if (token !== stepToken || isSelected(kind)) return; // moved on / already selected
          if (kind !== "hover") tourSelected = true;
          select(kind);
          if (attemptsLeft > 0) setTimeout(() => attempt(attemptsLeft - 1), 500);
        };
        setTimeout(() => attempt(3), 300);

        // move the selected dot with the arrow keys, as a user would
        if (currentTitle === DOT_STEP_TITLE) {
          ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].forEach((key, i) =>
            setTimeout(() => {
              if (token !== stepToken || !isSelected("dot")) return;
              pressKey(key);
            }, 1800 + i * 1100)
          );
        }
      });

      // start at the first step (without side effects), then jump to the wanted step
      launching = !!startAt;
      tour
        .start()
        .then(async () => {
          if (!startAt) return;
          launching = false;
          await tour.goToStep(startAt);
          await wait(700); // let the page scroll and the highlight settle before showing it
          showTour();
        })
        .catch((error) => {
          showTour();
          console.error("Corpuswide tour:", error);
        });
    };

    launch(0);

    return () => {
      introRef.current?.exit(true);
      showTour();
      removePlotArea();
      raiseTooltip(false);
    };
  }, [run]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export { TOUR_KEY, DEMO_BOOKS };
export default CorpuswideVisualizationTour;
