/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import { TestGrid } from "./components/TestGrid";

const ToolBoxItem = ({ item, onTakeItem }) => {
  return (
    <div className="toolbox__items__item" onClick={() => onTakeItem(item)}>
      {item.i}
    </div>
  );
};

const ToolBox = ({ onTakeItem, items }) => {
  return (
    <div className="toolbox">
      <span className="toolbox__title">Toolbox</span>
      <div className="toolbox__items">
        {items.map((item) => (
          <ToolBoxItem key={item.i} item={item} onTakeItem={onTakeItem} />
        ))}
      </div>
    </div>
  );
};

function generateLayout() {
  return _.map(_.range(0, 25), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (_.random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05,
    };
  });
}

function App() {
  const [page, setPage] = useState({
    x: 0,
    y: 0,
  });

  const onChange = (e, key) => {
    const { value } = e.target;
    setPage((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function () {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    initialLayout: generateLayout(),
  };

  const [state, setState] = useState({
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    layouts: { lg: defaultProps.initialLayout },
    toolbox: { lg: [] },
  });

  const generateDOM = () => {
    return _.map(state.layouts[state.currentBreakpoint], (l) => {
      return (
        <div key={l.i} className={l.static ? "static" : ""}>
          <div className="hide-button" onClick={() => onPutItem(l)}>
            &times;
          </div>
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {l.i}
            </span>
          ) : (
            <span className="text">{l.i}</span>
          )}
        </div>
      );
    });
  };

  const onBreakpointChange = (breakpoint) => {
    setState((prev) => ({
      ...prev,
      currentBreakpoint: breakpoint,
      toolbox: {
        ...prev.toolbox,
        [breakpoint]:
          prev.toolbox[breakpoint] ||
          prev.toolbox[prev.currentBreakpoint] ||
          [],
      },
    }));
  };

  const onCompactTypeChange = () => {
    const { compactType: oldCompactType } = state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
        ? null
        : "horizontal";

    setState((prev) => ({
      ...prev,
      compactType,
    }));
  };

  const onTakeItem = (item) => {
    setState((prevState) => ({
      ...prevState,
      toolbox: {
        ...prevState.toolbox,
        [prevState.currentBreakpoint]: prevState.toolbox[
          prevState.currentBreakpoint
        ].filter(({ i }) => i !== item.i),
      },
      layouts: {
        ...prevState.layouts,
        [prevState.currentBreakpoint]: [
          ...prevState.layouts[prevState.currentBreakpoint],
          item,
        ],
      },
    }));
  };

  const onPutItem = (item) => {
    this.setState((prevState) => {
      return {
        toolbox: {
          ...prevState.toolbox,
          [prevState.currentBreakpoint]: [
            ...(prevState.toolbox[prevState.currentBreakpoint] || []),
            item,
          ],
        },
        layouts: {
          ...prevState.layouts,
          [prevState.currentBreakpoint]: prevState.layouts[
            prevState.currentBreakpoint
          ].filter(({ i }) => i !== item.i),
        },
      };
    });
  };

  const onLayoutChange = (layout, layouts) => {
    defaultProps.onLayoutChange(layout, layouts);
    setState((prev) => ({
      ...prev,
      layouts,
    }));
  };

  const onNewLayout = () => {
    setState((prev) => ({
      ...prev,
      layouts: {
        lg: generateLayout(),
      },
    }));
  };

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      mounted: true,
    }));
  }, []);

  return (
    <>
      <TestGrid />
    </>
    // <div className="w-full h-screen bg-slate-100">
    //   <div>
    //     Current Breakpoint: {state.currentBreakpoint} (
    //     {defaultProps.cols[state.currentBreakpoint]} columns)
    //   </div>
    //   <div>
    //     Compaction type: {_.capitalize(state.compactType) || "No Compaction"}
    //   </div>
    //   <button onClick={onNewLayout}>Generate New Layout</button>
    //   <button onClick={onCompactTypeChange}>Change Compaction Type</button>
    //   <div className="space-x-5">
    //     <input value={page.x} onChange={(ev) => onChange(ev, "x")} />
    //     <input value={page.y} onChange={(ev) => onChange(ev, "y")} />
    //     <button>페이지추가</button>
    //     <button>세척기 600</button>
    //     <button>세척기 800</button>
    //     <button>세척기 1000</button>
    //   </div>
    //   <ToolBox
    //     items={state.toolbox[state.currentBreakpoint] || []}
    //     onTakeItem={onTakeItem}
    //   />
    //   <ResponsiveReactGridLayout
    //     {...defaultProps}
    //     style={{
    //       background: "f0f0f0",
    //     }}
    //     layouts={state.layouts}
    //     onBreakpointChange={onBreakpointChange}
    //     onLayoutChange={onLayoutChange}
    //     measureBeforeMount={false}
    //     useCSSTransforms={state.mounted}
    //     compactType={state.compactType}
    //     preventCollision={!state.compactType}
    //   >
    //     {generateDOM()}
    //   </ResponsiveReactGridLayout>
    //   <div
    //     className={`border bg-white`}
    //     style={{
    //       width: `${page.x * 0.37795275591}px`,
    //       height: `${page.y * 0.37795275591}px`,
    //     }}
    //   ></div>
    // </div>
  );
}

export default App;
