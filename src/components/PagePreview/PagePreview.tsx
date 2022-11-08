import React from "react";
import { createStyles, Modal } from "@mantine/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from "swiper";
import { Page } from "@/models";
import { Thumbnail } from "../Thumbnail";

import "swiper/css";
import "swiper/css/keyboard";
import "swiper/css/navigation";

interface Props {
  onClickOutside: () => void;
  selectedPage: Page;
  sourcePath: string; // TODO this should be accessible via global context
  pages: Page[];
}

const useStyles = createStyles((_theme, _params) => ({
  slide: {
    display: 'flex',
    justifyContent: 'center',
  }
}))

const PagePreview: React.FC<Props> = ({
  pages,
  sourcePath,
  selectedPage,
  onClickOutside,
}) => {

  const { classes } = useStyles();

  const initialPageNumber = pages.findIndex(page => page.id === selectedPage.id);

  return (
    <Modal fullScreen opened onClose={onClickOutside}>
      <Swiper
        modules={[Navigation, Keyboard]}
        keyboard
        navigation
        spaceBetween={50}
        slidesPerView={1}
        initialSlide={initialPageNumber}
        style={{ zIndex: 201, position: "relative", height: "90vh" }}
      >
        {pages.map((page) => {
          return (
            <SwiperSlide key={page.svg.file} className={classes.slide}>
              <Thumbnail
                src={`safe-file-protocol://${sourcePath}/png/${page.svg.file}.png`}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Modal>
  );
};
export default PagePreview;
