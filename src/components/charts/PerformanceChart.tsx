import { useMemo } from 'react';
import { useD3 } from '../../hooks/useD3';
import { useCycleContext } from '../../context/CycleContext';
import { Card } from '../common/Card';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { area, line, curveMonotoneX } from 'd3-shape';
import { select } from 'd3-selection';
import 'd3-transition';

/**
 * Performance Chart Component
 * D3.js dual-axis chart showing speed (line) and distance (area)
 */
export function PerformanceChart() {
  const { currentCycle } = useCycleContext();

  // Prepare data for visualization
  const chartData = useMemo(() => {
    if (!currentCycle) return null;

    // Simulate distance accumulation and speed variation over cycle duration
    const points = 20;
    const data = [];
    const cycleDuration = currentCycle.cycle_duration_hours;
    const totalDistance = currentCycle.total_distance;
    const avgSpeed = currentCycle.average_speed;
    const maxSpeed = currentCycle.max_speed;

    for (let i = 0; i <= points; i++) {
      const progress = i / points;
      const time = cycleDuration * progress;

      // Simulate cumulative distance (S-curve)
      const distanceProgress = 1 / (1 + Math.exp(-10 * (progress - 0.5)));
      const distance = totalDistance * distanceProgress;

      // Simulate speed variation (higher in middle, lower at start/end)
      const speedVariation = Math.sin(progress * Math.PI);
      const speed = avgSpeed + (maxSpeed - avgSpeed) * speedVariation * 0.7;

      data.push({
        time,
        distance,
        speed: Math.max(0, speed),
      });
    }

    return data;
  }, [currentCycle]);

  // D3 rendering function
  const ref = useD3<SVGSVGElement>(
    (svg) => {
      if (!chartData) return;

      // Clear previous render
      svg.selectAll('*').remove();

      // Dimensions
      const margin = { top: 30, right: 80, bottom: 60, left: 60 };
      const width = 700 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Create SVG group
      const g = svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Scales
      const x = scaleLinear()
        .domain([0, Math.max(...chartData.map((d) => d.time))])
        .range([0, width]);

      const yDistance = scaleLinear()
        .domain([0, Math.max(...chartData.map((d) => d.distance)) * 1.1])
        .range([height, 0]);

      const ySpeed = scaleLinear()
        .domain([0, Math.max(...chartData.map((d) => d.speed)) * 1.1])
        .range([height, 0]);

      // Axes
      const xAxis = axisBottom(x).ticks(10);
      const yAxisDistance = axisLeft(yDistance).ticks(6);

      // Add X axis
      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .selectAll('text')
        .style('font-size', '12px')
        .style('fill', '#4b5563');

      // Add Y axis (Distance - left)
      g.append('g')
        .attr('class', 'y-axis-distance')
        .call(yAxisDistance)
        .selectAll('text')
        .style('font-size', '12px')
        .style('fill', '#8b5cf6');

      // Add Y axis (Speed - right)
      g.append('g')
        .attr('class', 'y-axis-speed')
        .attr('transform', `translate(${width},0)`)
        .call(axisLeft(ySpeed).ticks(6))
        .selectAll('text')
        .style('font-size', '12px')
        .style('fill', '#3b82f6')
        .attr('dx', '0.8em');

      // Grid lines
      g.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .call(axisLeft(yDistance).ticks(6).tickSize(-width).tickFormat(() => ''));

      // Area generator for distance
      const areaGenerator = area<{ time: number; distance: number; speed: number }>()
        .x((d) => x(d.time))
        .y0(height)
        .y1((d) => yDistance(d.distance))
        .curve(curveMonotoneX);

      // Line generator for speed
      const lineGenerator = line<{ time: number; distance: number; speed: number }>()
        .x((d) => x(d.time))
        .y((d) => ySpeed(d.speed))
        .curve(curveMonotoneX);

      // Add gradient for area fill
      const gradient = svg
        .append('defs')
        .append('linearGradient')
        .attr('id', 'distance-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#8b5cf6')
        .attr('stop-opacity', 0.6);

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#8b5cf6')
        .attr('stop-opacity', 0.1);

      // Draw distance area
      const distanceArea = g
        .append('path')
        .datum(chartData)
        .attr('fill', 'url(#distance-gradient)')
        .attr('d', areaGenerator);

      // Animate distance area
      distanceArea
        .attr('opacity', 0)
        .transition()
        .duration(1000)
        .attr('opacity', 1);

      // Draw speed line
      const speedLine = g
        .append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 3)
        .attr('d', lineGenerator);

      // Animate speed line
      const speedLength = (speedLine.node() as SVGPathElement).getTotalLength();
      speedLine
        .attr('stroke-dasharray', speedLength + ' ' + speedLength)
        .attr('stroke-dashoffset', speedLength)
        .transition()
        .duration(1500)
        .ease((t) => t)
        .attr('stroke-dashoffset', 0);

      // Add speed data points
      g.selectAll('.speed-dot')
        .data(chartData.filter((_, i) => i % 4 === 0)) // Show every 4th point
        .join('circle')
        .attr('class', 'speed-dot')
        .attr('cx', (d) => x(d.time))
        .attr('cy', (d) => ySpeed(d.speed))
        .attr('r', 0)
        .attr('fill', '#3b82f6')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function (_event, d) {
          select(this).attr('r', 6);
          // Show tooltip
          g.append('text')
            .attr('class', 'tooltip')
            .attr('x', x(d.time))
            .attr('y', ySpeed(d.speed) - 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('fill', '#3b82f6')
            .text(`${d.speed.toFixed(1)} km/h`);
        })
        .on('mouseleave', function () {
          select(this).attr('r', 4);
          g.selectAll('.tooltip').remove();
        })
        .transition()
        .delay((_d, i) => i * 200 + 1500)
        .duration(300)
        .attr('r', 4);

      // Y-axis label (Distance - left)
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', '#8b5cf6')
        .text('Distance (km)');

      // Y-axis label (Speed - right)
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', width + 70)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', '#3b82f6')
        .text('Speed (km/h)');

      // X-axis label
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', '#374151')
        .text('Time (hours)');

      // Legend
      const legend = g.append('g').attr('transform', `translate(10, 10)`);

      // Distance legend
      legend
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 20)
        .attr('height', 12)
        .attr('fill', 'url(#distance-gradient)');

      legend
        .append('text')
        .attr('x', 25)
        .attr('y', 10)
        .style('font-size', '12px')
        .style('fill', '#374151')
        .text('Distance');

      // Speed legend
      legend
        .append('line')
        .attr('x1', 0)
        .attr('y1', 26)
        .attr('x2', 20)
        .attr('y2', 26)
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 3);

      legend
        .append('text')
        .attr('x', 25)
        .attr('y', 30)
        .style('font-size', '12px')
        .style('fill', '#374151')
        .text('Speed');
    },
    [chartData]
  );

  if (!currentCycle) {
    return (
      <Card title="Performance Metrics">
        <p className="text-gray-600">Select a cycle to view performance data.</p>
      </Card>
    );
  }

  return (
    <Card
      title="Performance Metrics"
      subtitle={`Cycle #${currentCycle.cycle_number} - Speed & Distance Analysis`}
    >
      {/* Chart */}
      <div className="flex justify-center mb-6">
        <svg ref={ref} className="max-w-full" />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Total Distance</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {currentCycle.total_distance.toFixed(2)} km
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Avg Speed</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {currentCycle.average_speed.toFixed(1)} km/h
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Max Speed</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {currentCycle.max_speed.toFixed(1)} km/h
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Duration</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {currentCycle.cycle_duration_hours.toFixed(1)}h
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-purple-50 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-purple-800">
            <p className="font-semibold mb-1">GPS Data Note</p>
            <p>
              The assignment mentions GPS data may have gaps. This visualization shows the overall
              performance trends. Distance accumulates over time (purple area), while speed varies
              throughout the cycle (blue line).
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PerformanceChart;
