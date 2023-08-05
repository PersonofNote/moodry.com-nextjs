// Based on https://typeofnan.dev/how-to-perfectly-fit-an-svg-to-its-contents-using-javascript/

type SVGWithChildrenProps = React.SVGProps<SVGSVGElement> & {
    children?: React.SVGProps<SVGSVGElement>;
  };

export const useSVGBounds = (svg: SVGWithChildrenProps) => {
    const { xMin, xMax, yMin, yMax } = [...svg.children].reduce((acc, el) => {
    const { x, y, width, height } = el.getBBox();
    if (!acc.xMin || x < acc.xMin) acc.xMin = x;
    if (!acc.xMax || x + width > acc.xMax) acc.xMax = x + width;
    if (!acc.yMin || y < acc.yMin) acc.yMin = y;
    if (!acc.yMax || y + height > acc.yMax) acc.yMax = y + height;
    return acc;
    }, {});
    return {xMin, xMax, yMin, yMax}

}

