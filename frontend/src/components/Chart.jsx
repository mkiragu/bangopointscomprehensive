export const BarChart = ({ data, labels, height = 200 }) => {
  const maxValue = data.length ? Math.max(...data) : 0;

  return (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height }}>
    {data.map((value, i) => {
      const barHeight = maxValue <= 0 ? 0 : (value / maxValue) * 100;
      return (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: '100%',
              height: `${barHeight}%`,
              background: 'linear-gradient(to top, #3b82f6, #60a5fa)',
              borderRadius: '4px 4px 0 0',
              position: 'relative',
              transition: 'height 0.3s ease'
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {value.toLocaleString()}
            </span>
          </div>
          <span style={{ fontSize: '11px', marginTop: '5px', color: '#666' }}>{labels[i]}</span>
        </div>
      );
    })}
  </div>
  );
};
