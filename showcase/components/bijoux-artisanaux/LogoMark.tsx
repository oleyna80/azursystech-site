type LogoMarkProps = {
  className?: string
  curveId: string
}

export function LogoMark({ className, curveId }: LogoMarkProps) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M 100 18 C 118 19, 143 23, 161 39 C 178 54, 182 78, 181 100 C 180 122, 175 147, 159 162 C 143 177, 119 181, 100 182 C 78 181, 53 176, 38 160 C 23 144, 18 119, 19 100 C 18 78, 24 53, 40 38 C 55 23, 79 18, 100 18 Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M 100 25 C 115 26, 136 30, 150 43 C 164 56, 168 76, 167 95 C 166 114, 161 135, 148 147 C 135 159, 115 163, 100 164 C 82 163, 62 158, 50 145 C 38 132, 34 112, 35 95 C 34 76, 39 56, 52 44 C 65 31, 84 26, 100 25 Z"
        fill="none"
        stroke="currentColor"
        strokeDasharray="3 3"
        strokeWidth="0.8"
      />
      <path id={curveId} d="M 46 142 A 62 62 0 0 0 154 142" fill="none" />
      <text fontFamily="'DM Sans', sans-serif" fontSize="7.5" fontWeight="600" letterSpacing="0.22em" fill="currentColor">
        <textPath href={`#${curveId}`} startOffset="50%" textAnchor="middle">
          ATELIER LIORA
        </textPath>
      </text>
      <g transform="translate(100, 94)">
        <text x="-8" y="10" fontFamily="'Libre Caslon Text', serif" fontSize="44" fontWeight="400" fill="currentColor">
          L
        </text>
        <text x="7" y="-2" fontFamily="'Libre Caslon Text', serif" fontSize="28" fontStyle="italic" fontWeight="300" fill="currentColor">
          a
        </text>
        <path d="M 12 -28 Q 12 -20 20 -20 Q 12 -20 12 -12 Q 12 -20 4 -20 Q 12 -20 12 -28" fill="currentColor" />
      </g>
    </svg>
  )
}
