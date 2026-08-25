export default function About() {
  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">About This Project</span>
          <h2>Employee Management System</h2>
          <p>
            A simple employee management system designed to manage employee
            information efficiently.
          </p>
        </div>
      </div>

      <div className="card card-pad">
        <h3 style={{ fontSize: 15, marginBottom: 10 }}>
          About the Employee Management System
        </h3>

        <p
          style={{
            color: 'var(--ink-700)',
            fontSize: 13.5,
            lineHeight: 1.7,
          }}
        >
          The Employee Management System allows users to manage employee
          information in one place. Users can view employee details, add new
          employees, edit existing employee information, and delete employees
          when they are no longer required.
        </p>

        <p
          style={{
            color: 'var(--ink-700)',
            fontSize: 13.5,
            lineHeight: 1.7,
            marginTop: 12,
          }}
        >
          The system provides a simple and user-friendly interface for
          maintaining employee records and makes it easier to organize and
          manage employee information.
        </p>
      </div>
    </div>
  )
}