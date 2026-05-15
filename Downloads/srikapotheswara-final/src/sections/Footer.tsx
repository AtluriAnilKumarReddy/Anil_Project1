export default function Footer() {
  return (
    <footer
      id="footer"
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #000000',
        padding: '80px clamp(20px, 4vw, 60px) 0',
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      {/* Top: Office Info */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          paddingBottom: '80px',
        }}
      >
        <OfficeColumn
          city="Deluxe PG"
          cityEn="KPHB COLONY"
          address="Backside of Malabar Gold, LIG-608, Kukatpally, Hyderabad"
          coords="17.4933° N, 78.3914° E"
          timezone="IST+5:30"
        />
        <OfficeColumn
          city="Executive PG"
          cityEn="KPHB COLONY"
          address="LIG-646, Road No. 5, Kukatpally Housing Board Colony, Hyderabad"
          coords="17.4940° N, 78.3920° E"
          timezone="IST+5:30"
        />
        <OfficeColumn
          city="Premium PG"
          cityEn="KPHB COLONY"
          address="LIG-645, Backside of Malabar Gold, Kukatpally, Hyderabad"
          coords="17.4938° N, 78.3918° E"
          timezone="IST+5:30"
        />
        <div>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              color: '#000000',
              marginBottom: '20px',
            }}
          >
            CONTACT
          </p>
          <p style={{ fontSize: '14px', color: '#666666', lineHeight: 2 }}>
            srikapotheswarawomenspg@gmail.com
            <br />
            +91 98499 37305 / +91 83670 74254
            <br />
            Near KPHB Metro, Kukatpally, Hyderabad
          </p>
        </div>
      </div>

      {/* Bottom: Giant Wordmark */}
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0.85,
          paddingBottom: '0',
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: 'clamp(80px, 18vw, 320px)',
            fontWeight: 400,
            letterSpacing: '-0.04em',
            color: '#000000',
            whiteSpace: 'nowrap',
            transform: 'translateY(15%)',
            userSelect: 'none',
          }}
        >
          KAPOTHESWARA
        </span>
      </div>
    </footer>
  )
}

function OfficeColumn({
  city,
  cityEn,
  address,
  coords,
  timezone,
}: {
  city: string
  cityEn: string
  address: string
  coords: string
  timezone: string
}) {
  return (
    <div>
      <p
        style={{
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.18em',
          color: '#000000',
          marginBottom: '20px',
        }}
      >
        {cityEn}
      </p>
      <p style={{ fontSize: '16px', fontWeight: 500, color: '#000000', marginBottom: '8px' }}>
        {city}
      </p>
      <p
        style={{
          fontSize: '14px',
          color: '#666666',
          lineHeight: 1.6,
          marginBottom: '12px',
          maxWidth: '260px',
        }}
      >
        {address}
      </p>
      <p
        style={{
          fontSize: '11px',
          letterSpacing: '0.05em',
          color: '#666666',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {coords}
        <br />
        {timezone}
      </p>
    </div>
  )
}
