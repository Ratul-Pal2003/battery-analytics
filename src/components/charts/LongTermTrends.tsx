import { useMemo } from 'react';
import { useD3 } from '../../hooks/useD3';
import { useBatteryContext } from '../../context/BatteryContext';
import { useCycleSnapshots } from '../../hooks/useCycleSnapshots';
import { Card } from '../common/Card';
import { safeToFixed } from '../../utils/formatters';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line, curveMonotoneX } from 'd3-shape';
import { select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { brushX } from 'd3-brush';
import 'd3-transition';

/**
 * Long-term Trend Analysis Component (Bonus Feature)
 * D3.js chart showing SOH degradation across all cycles with zoom and brush selection
 */
export function LongTermTrends() {
  const { selectedIMEI } = useBatteryContext();
  const { data: snapshotsData, isLoading } = useCycleSnapshots({
    imei: selectedIMEI || '',
    limit: 1000,
    offset: 0,
  });

  // Prepare data for visualization
  const chartData = useMemo(() => {
    if (!snapshotsData?.snapshots) return [];

    return snapshotsData.snapshots
      .map((cycle) => ({
        cycle_number: cycle.cycle_number,
        soh: cycle.average_soh,
        soh_drop: cycle.soh_drop,
        timestamp: new Date(cycle.cycle_start_time).getTime(),
      }))
      .sort((a, b) => a.cycle_number - b.cycle_number);
  }, [snapshotsData]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const sohValues = chartData.map((d) => d.soh);
    const firstSOH = sohValues[0];
    const lastSOH = sohValues[sohValues.length - 1];
    const totalDegradation = firstSOH - lastSOH;
    const avgDegradationPerCycle = totalDegradation / chartData.length;

    return {
      firstSOH,
      lastSOH,
      totalDegradation,
      avgDegradationPerCycle,
      totalCycles: chartData.length,
      minSOH: Math.min(...sohValues),
      maxSOH: Math.max(...sohValues),
    };
  }, [chartData]);

  // D3 rendering function with zoom and brush
  const ref = useD3<SVGSVGElement>(
    (svg) => {
      if (chartData.length === 0) return;

      // Clear previous render
      svg.selectAll('*').remove();

      // Dimensions
      const margin = { top: 30, right: 30, bottom: 100, left: 60 };
      const width = 900 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;
      const brushHeight = 50;

      // Main chart group
      const g = svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + brushHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Scales
      const x = scaleLinear()
        .domain([0, Math.max(...chartData.map((d) => d.cycle_number))])
        .range([0, width]);

      const y = scaleLinear()
        .domain([
          Math.min(...chartData.map((d) => d.soh)) - 1,
          Math.max(...chartData.map((d) => d.soh)) + 1,
        ])
        .range([height, 0]);

      // Brush scales (for overview)
      const xBrush = scaleLinear()
        .domain(x.domain())
        .range([0, width]);

      const yBrush = scaleLinear()
        .domain(y.domain())
        .range([brushHeight, 0]);

      // Clip path for zoom
      g.append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width)
        .attr('height', height);

      // Grid lines
      g.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .call(axisLeft(y).ticks(10).tickSize(-width).tickFormat(() => ''));

      // Line generator
      const lineGenerator = line<{ cycle_number: number; soh: number }>()
        .x((d) => x(d.cycle_number))
        .y((d) => y(d.soh))
        .curve(curveMonotoneX);

      // Add gradient for line
      const gradient = svg
        .append('defs')
        .append('linearGradient')
        .attr('id', 'soh-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');

      gradient.append('stop').attr('offset', '0%').attr('stop-color', '#10b981');
      gradient.append('stop').attr('offset', '50%').attr('stop-color', '#f59e0b');
      gradient.append('stop').attr('offset', '100%').attr('stop-color', '#ef4444');

      // Main line path
      const path = g
        .append('path')
        .datum(chartData)
        .attr('clip-path', 'url(#clip)')
        .attr('fill', 'none')
        .attr('stroke', 'url(#soh-gradient)')
        .attr('stroke-width', 3)
        .attr('d', lineGenerator);

      // Animate line
      const pathLength = (path.node() as SVGPathElement).getTotalLength();
      path
        .attr('stroke-dasharray', pathLength + ' ' + pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(2000)
        .ease((t) => t)
        .attr('stroke-dashoffset', 0);

      // Data points
      const dots = g
        .append('g')
        .attr('clip-path', 'url(#clip)')
        .selectAll('.dot')
        .data(chartData)
        .join('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => x(d.cycle_number))
        .attr('cy', (d) => y(d.soh))
        .attr('r', 0)
        .attr('fill', (d) => {
          if (d.soh >= 95) return '#10b981';
          if (d.soh >= 90) return '#f59e0b';
          return '#ef4444';
        })
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function (_event, d) {
          select(this).attr('r', 6);
          // Show tooltip
          g.append('text')
            .attr('class', 'tooltip')
            .attr('x', x(d.cycle_number))
            .attr('y', y(d.soh) - 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('font-weight', '600')
            .style('fill', '#1f2937')
            .style('background', 'white')
            .text(`Cycle ${d.cycle_number}: ${d.soh.toFixed(2)}%`);
        })
        .on('mouseleave', function () {
          select(this).attr('r', 3);
          g.selectAll('.tooltip').remove();
        });

      // Animate dots
      dots
        .transition()
        .delay((_d, i) => i * 10 + 2000)
        .duration(300)
        .attr('r', 3);

      // Axes
      const xAxis = g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x));

      const yAxis = g.append('g').call(axisLeft(y).ticks(10));

      xAxis.selectAll('text').style('font-size', '12px').style('fill', '#4b5563');
      yAxis.selectAll('text').style('font-size', '12px').style('fill', '#4b5563');

      // Axis labels
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', '#374151')
        .text('Cycle Number');

      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', '#374151')
        .text('State of Health (%)');

      // Zoom functionality
      const zoomBehavior = zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 10])
        .translateExtent([
          [0, 0],
          [width, height],
        ])
        .extent([
          [0, 0],
          [width, height],
        ])
        .on('zoom', (event) => {
          const newX = event.transform.rescaleX(x);

          // Update line
          path.attr(
            'd',
            line<{ cycle_number: number; soh: number }>()
              .x((d) => newX(d.cycle_number))
              .y((d) => y(d.soh))
              .curve(curveMonotoneX)
          );

          // Update dots
          dots.attr('cx', (d) => newX(d.cycle_number));

          // Update x-axis
          xAxis.call(axisBottom(newX) as any);
        });

      svg.call(zoomBehavior as any);

      // Brush for overview (mini chart)
      const brushG = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${height + margin.top + 60})`);

      // Brush background
      brushG
        .append('rect')
        .attr('width', width)
        .attr('height', brushHeight)
        .attr('fill', '#f3f4f6')
        .attr('rx', 4);

      // Brush line
      const brushLine = line<{ cycle_number: number; soh: number }>()
        .x((d) => xBrush(d.cycle_number))
        .y((d) => yBrush(d.soh))
        .curve(curveMonotoneX);

      brushG
        .append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', '#6366f1')
        .attr('stroke-width', 2)
        .attr('d', brushLine);

      // Brush
      const brush = brushX()
        .extent([
          [0, 0],
          [width, brushHeight],
        ])
        .on('brush end', (event) => {
          if (event.selection) {
            const [x0, x1] = event.selection.map(xBrush.invert);

            svg.call(
              zoomBehavior.transform as any,
              zoomIdentity
                .scale(width / (x(x1) - x(x0)))
                .translate(-x(x0), 0)
            );
          }
        });

      brushG.append('g').attr('class', 'brush').call(brush);
    },
    [chartData]
  );

  if (!selectedIMEI) {
    return (
      <Card title="📈 Long-term Trend Analysis">
        <p className="text-gray-600">Select a battery to view long-term SOH trends.</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card title="📈 Long-term Trend Analysis">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="📈 Long-term Trend Analysis"
      subtitle="Cross-cycle SOH Degradation (Bonus Feature)"
      className="border-l-4 border-blue-500"
    >
      {chartData.length > 0 ? (
        <>
          {/* Chart */}
          <div className="flex justify-center mb-6 overflow-x-auto">
            <svg ref={ref} className="max-w-full" />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium uppercase">Total Cycles</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalCycles}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium uppercase">Initial SOH</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {safeToFixed(stats?.firstSOH, 2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium uppercase">Current SOH</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {safeToFixed(stats?.lastSOH, 2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium uppercase">Degradation</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                -{safeToFixed(stats?.totalDegradation, 2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium uppercase">Avg/Cycle</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                -{safeToFixed(stats?.avgDegradationPerCycle, 3)}%
              </p>
            </div>
          </div>

          {/* Features Info */}
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
                <p className="font-semibold mb-1">Interactive Features</p>
                <p className="mb-2">
                  • <strong>Zoom:</strong> Scroll to zoom in/out on the chart
                </p>
                <p className="mb-2">
                  • <strong>Pan:</strong> Click and drag to move around while zoomed
                </p>
                <p className="mb-2">
                  • <strong>Brush Selection:</strong> Use the mini chart below to select a specific
                  range
                </p>
                <p>
                  • <strong>Hover:</strong> Mouse over data points to see exact SOH values
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-center py-8">
          No cycle data available for long-term analysis.
        </p>
      )}
    </Card>
  );
}

export default LongTermTrends;
