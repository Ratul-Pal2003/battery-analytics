import { useMemo } from 'react';
import { useD3 } from '../../hooks/useD3';
import { useCycleContext } from '../../context/CycleContext';
import { Card } from '../common/Card';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line } from 'd3-shape';
import { select } from 'd3-selection';
import { safeToFixed } from '../../utils/formatters';
import 'd3-transition';

/**
 * Battery Health Chart Component
 * D3.js line chart showing SOC and SOH metrics for the current cycle
 */
export function BatteryHealthChart() {
  const { currentCycle } = useCycleContext();

  // Prepare data for visualization
  const chartData = useMemo(() => {
    if (!currentCycle) return null;

    return {
      soc: {
        average: currentCycle.average_soc,
        min: currentCycle.min_soc,
        max: currentCycle.max_soc,
      },
      soh: {
        average: currentCycle.average_soh,
        min: currentCycle.min_soh,
        max: currentCycle.max_soh,
        drop: currentCycle.soh_drop,
      },
    };
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

      // Data points for the chart (simulating progression through cycle)
      const points = 5; // Start, 25%, 50%, 75%, End
      const socData = [
        { x: 0, y: chartData.soc.min },
        { x: 1, y: (chartData.soc.min + chartData.soc.average) / 2 },
        { x: 2, y: chartData.soc.average },
        { x: 3, y: (chartData.soc.average + chartData.soc.max) / 2 },
        { x: 4, y: chartData.soc.max },
      ];

      const sohData = [
        { x: 0, y: chartData.soh.max },
        { x: 1, y: chartData.soh.max - chartData.soh.drop * 0.25 },
        { x: 2, y: chartData.soh.average },
        { x: 3, y: chartData.soh.average - chartData.soh.drop * 0.25 },
        { x: 4, y: chartData.soh.min },
      ];

      // Scales
      const x = scaleLinear()
        .domain([0, points - 1])
        .range([0, width]);

      const y = scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

      // Axes
      const xAxis = axisBottom(x)
        .ticks(points)
        .tickFormat((d) => {
          const labels = ['Start', '25%', '50%', '75%', 'End'];
          return labels[d as number] || '';
        });

      const yAxis = axisLeft(y).ticks(10);

      // Add X axis
      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .selectAll('text')
        .style('font-size', '12px')
        .style('fill', '#4b5563');

      // Add Y axis
      g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis)
        .selectAll('text')
        .style('font-size', '12px')
        .style('fill', '#4b5563');

      // Grid lines
      g.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .call(axisLeft(y).ticks(10).tickSize(-width).tickFormat(() => ''));

      // Line generators
      const socLine = line<{ x: number; y: number }>()
        .x((d) => x(d.x))
        .y((d) => y(d.y));

      const sohLine = line<{ x: number; y: number }>()
        .x((d) => x(d.x))
        .y((d) => y(d.y));

      // SOC Line
      const socPath = g
        .append('path')
        .datum(socData)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 3)
        .attr('d', socLine);

      // Animate SOC line
      const socLength = (socPath.node() as SVGPathElement).getTotalLength();
      socPath
        .attr('stroke-dasharray', socLength + ' ' + socLength)
        .attr('stroke-dashoffset', socLength)
        .transition()
        .duration(1500)
        .ease((t) => t) // linear
        .attr('stroke-dashoffset', 0);

      // SOH Line
      const sohPath = g
        .append('path')
        .datum(sohData)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 3)
        .attr('d', sohLine);

      // Animate SOH line
      const sohLength = (sohPath.node() as SVGPathElement).getTotalLength();
      sohPath
        .attr('stroke-dasharray', sohLength + ' ' + sohLength)
        .attr('stroke-dashoffset', sohLength)
        .transition()
        .duration(1500)
        .ease((t) => t) // linear
        .attr('stroke-dashoffset', 0);

      // SOC data points
      g.selectAll('.soc-dot')
        .data(socData)
        .join('circle')
        .attr('class', 'soc-dot')
        .attr('cx', (d) => x(d.x))
        .attr('cy', (d) => y(d.y))
        .attr('r', 0)
        .attr('fill', '#10b981')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function (_event, d) {
          select(this).attr('r', 7);
          // Show tooltip
          g.append('text')
            .attr('class', 'tooltip')
            .attr('x', x(d.x))
            .attr('y', y(d.y) - 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('fill', '#10b981')
            .text(`${d.y.toFixed(1)}%`);
        })
        .on('mouseleave', function () {
          select(this).attr('r', 5);
          g.selectAll('.tooltip').remove();
        })
        .transition()
        .delay((_d, i) => i * 300 + 1500)
        .duration(300)
        .attr('r', 5);

      // SOH data points
      g.selectAll('.soh-dot')
        .data(sohData)
        .join('circle')
        .attr('class', 'soh-dot')
        .attr('cx', (d) => x(d.x))
        .attr('cy', (d) => y(d.y))
        .attr('r', 0)
        .attr('fill', '#f59e0b')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function (_event, d) {
          select(this).attr('r', 7);
          // Show tooltip
          g.append('text')
            .attr('class', 'tooltip')
            .attr('x', x(d.x))
            .attr('y', y(d.y) - 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('fill', '#f59e0b')
            .text(`${d.y.toFixed(1)}%`);
        })
        .on('mouseleave', function () {
          select(this).attr('r', 5);
          g.selectAll('.tooltip').remove();
        })
        .transition()
        .delay((_d, i) => i * 300 + 1500)
        .duration(300)
        .attr('r', 5);

      // Y-axis label
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', '#374151')
        .text('Percentage (%)');

      // X-axis label
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', '#374151')
        .text('Cycle Progress');

      // Legend
      const legend = g
        .append('g')
        .attr('transform', `translate(${width - 120}, 0)`);

      // SOC legend
      legend
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 30)
        .attr('y2', 0)
        .attr('stroke', '#10b981')
        .attr('stroke-width', 3);

      legend
        .append('text')
        .attr('x', 35)
        .attr('y', 5)
        .style('font-size', '12px')
        .style('fill', '#374151')
        .text('SOC');

      // SOH legend
      legend
        .append('line')
        .attr('x1', 0)
        .attr('y1', 20)
        .attr('x2', 30)
        .attr('y2', 20)
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 3);

      legend
        .append('text')
        .attr('x', 35)
        .attr('y', 25)
        .style('font-size', '12px')
        .style('fill', '#374151')
        .text('SOH');
    },
    [chartData]
  );

  if (!currentCycle) {
    return (
      <Card title="Battery Health Metrics">
        <p className="text-gray-600">Select a cycle to view battery health trends.</p>
      </Card>
    );
  }

  return (
    <Card
      title="Battery Health Metrics"
      subtitle={`Cycle #${currentCycle.cycle_number} - SOC & SOH Trends`}
    >
      {/* Chart */}
      <div className="flex justify-center mb-6">
        <svg ref={ref} className="max-w-full" />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Avg SOC</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {safeToFixed(chartData?.soc.average, 1)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">SOC Range</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {safeToFixed(chartData?.soc.min, 0)}% - {safeToFixed(chartData?.soc.max, 0)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Avg SOH</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {safeToFixed(chartData?.soh.average, 1)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">SOH Drop</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {safeToFixed(chartData?.soh.drop, 2)}%
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
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
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">About Battery Health Metrics</p>
            <p>
              <strong>SOC (State of Charge)</strong> shows the battery's current charge level.
              <strong> SOH (State of Health)</strong> indicates battery degradation over time.
              Higher SOH values mean better battery condition.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default BatteryHealthChart;
