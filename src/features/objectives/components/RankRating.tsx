import { useEffect, useState } from 'react';

import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';

import { SxProps, Theme } from '@mui/material/styles';

import { Ranks } from '@/constants';

const labels: { [index: string]: string } = {
  1: Ranks.D, 
  2: Ranks.C, 
  3: Ranks.B, 
  4: Ranks.A, 
  5: Ranks.S, 
};

const numberToString = (value: number) => {
  if (1 <= value && value <= 5 ) {
    return labels[value];
  }
  return "";
};

const stringToNumber = (value: string) => {
  switch(value) {
    case Ranks.D:
      return 1;
    case Ranks.C:
      return 2;
    case Ranks.B:
      return 3;
    case Ranks.A:
      return 4;
    case Ranks.S:
      return 5;
    default:
      return 0;
  }
}

const getLabelText = (value: number) => {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export type RankRatingProps = {
  value: number;
  readOnly: boolean;
  onChange?: (newValue: number) => void;
  size: string;
  sx: SxProps<Theme>;
}

export const RankRating = (props: RankRatingProps) => {
  const [value, setValue] = useState<number>(props.value ?? 3);
  const [hover, setHover] = useState(-1);

  useEffect(() => { setValue(props.value); }, [props.value ?? 3]);

  const containerStyle = {
    width: 200,
    display: 'flex',
    alignItems: 'center',
    ...props.sx, 
  }

  return (
    <Box sx={containerStyle} >
      <Rating
        name="rank-rating"
        value={value}
        precision={1}
        getLabelText={getLabelText}
        readOnly={props.readOnly}
        size={props.size ?? "medium"}
        onChange={(event, newValue) => {
          if(newValue === null) {
            return;
          }
          setValue(newValue);
          if (props.onChange) {
            props.onChange(newValue);
          }
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {value !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
      )}
    </Box>
  );
}
