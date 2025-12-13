import { useState, useMemo } from 'react';
import { useD3 } from '../../hooks/useD3';
import { useCycleContext } from '../../context/CycleContext';
import { Card } from '../common/Card';
import { getTemperatureDistribution, getTemperatureColor } from '../../utils/dataTransformers';
import { TEMPERATURE_SAMPLING_RATES } from '../../utils/constants';
import type { TemperatureSamplingRate } from '../../types/battery';
import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import 'd3-transition'; // Enable .transition() method on selections

/**
 * Temperature Distribution Chart Component
 * D3.js histogram showing time spent in different temperature ranges
 * with toggleable sampling rates (5°C, 10°C, 15°C, 20°C)
 */
export function TemperatureDistChart() {
  const { currentCycle } = useCycleContext();
  const [samplingRate, setSamplingRate] = useState<TemperatureSamplingRate>(10);

  // Transform data based on sampling rate
  const data = useMemo(() => {
    if (!currentCycle) return [];
    return getTemperatureDistribution(currentCycle, samplingRate);
  }, [currentCycle, samplingRate]);

  // D3 rendering function
  const ref = useD3<SVGSVGElement>(
    (svg) => {
      if (data.length === 0) return;

      // Clear previous render
      svg.selectAll('*').remove();

      // Dimensions
      const margin = { top: 20, right: 30, bottom: 60, left: 60 };
      const width = 700 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Create SVG group
      const g = svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Scales
      const x = scaleBand()
        .domain(data.map((d) => d.range))
        .range([0, width])
        .padding(0.2);

      const y = scaleLinear()
        .domain([0, max(data, (d) => d.minutes) || 0])
        .nice()
        .range([height, 0]);

      // Axes
      const xAxis = axisBottom(x);
      const yAxis = axisLeft(y).ticks(6);

      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)')
        .style('font-size', '12px')
        .style('fill', '#4b5563');

      g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis)
        .selectAll('text')
        .style('font-size', '12px')
        .style('fill', '#4b5563');

      // Bars with transition
      g.selectAll('.bar')
        .data(data)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.range) || 0)
        .attr('width', x.bandwidth())
        .attr('fill', (d) => getTemperatureColor(d.rangeStart))
        .attr('y', height)
        .attr('height', 0)
        .attr('rx', 4)
        .style('cursor', 'pointer')
        .on('mouseenter', function () {
          select(this).attr('opacity', 0.8);
        })
        .on('mouseleave', function () {
          select(this).attr('opacity', 1);
        })
        .transition()
        .duration(750)
        .attr('y', (d) => y(d.minutes))
        .attr('height', (d) => height - y(d.minutes));

      // Value labels on top of bars
      g.selectAll('.label')
        .data(data)
        .join('text')
        .attr('class', 'label')
        .attr('x', (d) => (x(d.range) || 0) + x.bandwidth() / 2)
        .attr('y', (d) => y(d.minutes) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', '#1f2937')
        .style('opacity', 0)
        .text((d) => d.minutes.toFixed(1))
        .transition()
        .duration(750)
        .style('opacity', 1);

      // X-axis label
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 55)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', '#374151')
        .text('Temperature Range (°C)');

      // Y-axis label
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', '#374151')
        .text('Time (minutes)');
    },
    [data]
  );

  if (!currentCycle) {
    return (
      <Card title="Temperature Distribution">
        <p className="text-gray-600">Select a cycle to view temperature distribution.</p>
      </Card>
    );
  }

  const totalMinutes = data.reduce((sum, d) => sum + d.minutes, 0);

  return (
    <Card
      title="Temperature Distribution"
      subtitle={`Cycle #${currentCycle.cycle_number} - ${samplingRate}°C sampling rate`}
      headerAction={
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-medium">Sampling Rate:</span>
          <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
            {TEMPERATURE_SAMPLING_RATES.map((rate) => (
              <button
                key={rate}
                onClick={() => setSamplingRate(rate)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  samplingRate === rate
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-transparent text-gray-700 hover:bg-gray-200'
                }`}
              >
                {rate}°C
              </button>
            ))}
          </div>
        </div>
      }
    >
      {/* Chart */}
      <div className="flex justify-center mb-6">
        <svg ref={ref} className="max-w-full" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Avg Temperature</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {currentCycle.average_temperature.toFixed(1)}°C
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Total Time</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totalMinutes.toFixed(0)} min
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Temp Ranges</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Sampling</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{samplingRate}°C</p>
        </div>
      </div>

      {/* Color Legend */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <p className="text-xs font-semibold text-gray-700 mb-3">Temperature Color Scale:</p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#3b82f6' }}></div>
            <span className="text-xs text-gray-600">&lt; 10°C (Cold)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-xs text-gray-600">10-20°C (Cool)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-xs text-gray-600">20-30°C (Warm)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#f97316' }}></div>
            <span className="text-xs text-gray-600">30-40°C (Hot)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-xs text-gray-600">&gt; 40°C (Very Hot)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TemperatureDistChart;
