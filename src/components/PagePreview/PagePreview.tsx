import React, { useContext } from "react";
import { createStyles, Modal } from "@mantine/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Virtual } from "swiper";
import { Thumbnail } from "../Thumbnail";

import "swiper/css";
import "swiper/css/keyboard";
import "swiper/css/navigation";
import { PagesContext } from "@/services/context/pagesContext";
import { SourcePathContext } from "@/services/context/sourcePathContext";

interface Props {
  onClickOutside: () => void;
  selectedPageId: string;
  list: string[];
}

const useStyles = createStyles((_theme, _params) => ({
  slide: {
    display: "flex",
    justifyContent: "center",
  },
}));

const PagePreview: React.FC<Props> = ({
  list,
  selectedPageId,
  onClickOutside,
}) => {
  const { classes } = useStyles();
  const { pages } = useContext(PagesContext);
  const { sourcePath } = useContext(SourcePathContext);

  const initialPageNumber = list.findIndex(
    (pageId) => pageId === selectedPageId
  );

  return (
    <Modal fullScreen opened onClose={onClickOutside}>
      <Swiper
        modules={[Navigation, Keyboard, Virtual]}
        virtual
        keyboard
        navigation
        spaceBetween={50}
        slidesPerView={1}
        initialSlide={initialPageNumber}
        style={{ zIndex: 201, position: "relative", height: "90vh" }}
      >
        {list.map((pageId) => {
          const page = pages?.[pageId];
          return (
            <SwiperSlide key={page?.svg.file} className={classes.slide}>
              <Thumbnail
                src={`safe-file-protocol://${sourcePath}/jpg/${page?.svg.file}.jpg`}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Modal>
  );
};
export default PagePreview;
