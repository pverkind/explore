import React from "react";
import SectionHeaderLayout from "./SectionHeaderLayout";
import MetadataHeader from "./MetadataHeader";
import VisualizationHeader from "./VisualizationHeader";
import BookAlignmentHeader from "./BookAlignmentHeader";
/*import BooksHeader from "./BooksHeader";*/

const SectionHeader = ({ item, component, toggle, setToggle }) => {
  const getHeaderContents = () => {
    if (item.title === "Metadata") {
      return <MetadataHeader />;
    } else if (item.title === "Visualisation") {
      return <VisualizationHeader />;
      /*} else if (item.title === "Books Alignment") {
      return <BookAlignmentHeader />;*/
    } else if (item.title === "Books") {
      return <BookAlignmentHeader />;
    }
  };

  return (
    <SectionHeaderLayout
      item={item}
      component={component}
      toggle={toggle}
      setToggle={setToggle}
    >
      {getHeaderContents()}
    </SectionHeaderLayout>
  );
};

export default SectionHeader;
