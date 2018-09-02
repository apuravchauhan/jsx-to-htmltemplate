import { Custom } from './comp1';
class Foo extends React.Component {
  render({ a, b, c }) {
    return (<div>
      {(a.value == true || b == false) &&
        <Custom />
      }
      {c.map(d => {
        return <span>{d} loop</span>
      })
      }
    </div>);
  }
}
