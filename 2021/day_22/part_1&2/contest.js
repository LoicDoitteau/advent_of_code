fs = require("fs");
fs.readFile("./2021/day_22/input.txt", 'utf8', (err, input) => {
    const regex = /^(?<state>on|off) x=(?<xmin>-?\d+)\.\.(?<xmax>-?\d+),y=(?<ymin>-?\d+)\.\.(?<ymax>-?\d+),z=(?<zmin>-?\d+)\.\.(?<zmax>-?\d+)$/
    const regions = input.split('\r\n').map(line => objectMap(regex.exec(line).groups, (value) => isNaN(value) ? value : Number(value)));
    part2(regions);
});

const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v]) => [k, fn(v, k)]
    )
  );

hash = (x, y, z) => `${x},${y},${z}`;

part1 = (regions) => {
  const cubes = new Map();

  for (const {state, ...area} of regions) {
    if (Object.values(area).some(value => value < -50 || value > 50)) continue;

    const {xmin, xmax, ymin, ymax, zmin, zmax} = area;

    for (let x = xmin; x <= xmax; x++) {
      for (let y = ymin; y <= ymax; y++) {
        for (let z = zmin; z <= zmax; z++) {
          const key = hash(x, y, z);
          cubes.set(key, state);
        }
      }
    }
  }

  console.log([...cubes.values()].filter(state => state == 'on').length);
};

part2 = (regions) => {
  let onAreas = [];

  for (const {state, ...area} of regions) {
    const newOnAreas = [];
    for (const onArea of onAreas) {
      newOnAreas.push(...outerJoin(onArea, area));
    }
    if (state == 'on') newOnAreas.push(area);
    onAreas = newOnAreas;
  }

  console.log(onAreas.reduce((acc, area) => acc + size(area), 0));
}

overlaps = (area1, area2) => {
  if (area1.xmax < area2.xmin || area1.xmin > area2.xmax) return false;
  if (area1.ymax < area2.ymin || area1.ymin > area2.ymax) return false;
  if (area1.zmax < area2.zmin || area1.zmin > area2.zmax) return false;
  return true;
}

innerJoin = (area1, area2) => {
  if (!overlaps(area1, area2)) return null;

  const xmin = Math.max(area1.xmin, area2.xmin);
  const xmax = Math.min(area1.xmax, area2.xmax);
  const ymin = Math.max(area1.ymin, area2.ymin);
  const ymax = Math.min(area1.ymax, area2.ymax);
  const zmin = Math.max(area1.zmin, area2.zmin);
  const zmax = Math.min(area1.zmax, area2.zmax);

  return {xmin, xmax, ymin, ymax, zmin, zmax};
}

outerJoin = (area, extrudeArea) => {
  const overlapArea = innerJoin(area, extrudeArea); 
  if (!overlapArea) return [area];

  const areas = [];

  //LEFT
  if (area.xmin < overlapArea.xmin) {
    areas.push({...area, xmax: overlapArea.xmin - 1});
  }
  //RIGHT
  if (area.xmax > overlapArea.xmax) {
    areas.push({...area, xmin: overlapArea.xmax + 1});
  }
  //UP
  if (area.ymin < overlapArea.ymin) {
    areas.push({...area, ymax: overlapArea.ymin - 1, xmin: overlapArea.xmin, xmax: overlapArea.xmax });
  }
  //DOWN
  if (area.ymax > overlapArea.ymax) {
    areas.push({...area, ymin: overlapArea.ymax + 1, xmin: overlapArea.xmin, xmax: overlapArea.xmax });
  }
  //FRONT
  if (area.zmin < overlapArea.zmin) {
    areas.push({...area, zmax: overlapArea.zmin - 1, xmin: overlapArea.xmin, xmax: overlapArea.xmax, ymin: overlapArea.ymin, ymax: overlapArea.ymax });
  }
  //BOTTOM
  if (area.zmax > overlapArea.zmax) {
    areas.push({...area, zmin: overlapArea.zmax + 1, xmin: overlapArea.xmin, xmax: overlapArea.xmax, ymin: overlapArea.ymin, ymax: overlapArea.ymax });
  }

  return areas;
}

size = ({xmin, xmax, ymin, ymax, zmin, zmax}) => (xmax - xmin + 1) * (ymax - ymin + 1) * (zmax - zmin + 1);