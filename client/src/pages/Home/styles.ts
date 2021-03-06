import styled from 'styled-components';

export const Fragment = styled.div`
  margin-top: 4rem;
`;

export const Container = styled.div`
  width: 800px;
  height: 800px;
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 80px;

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }

  div {
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;

    span {
      color: #f4ede8;
    }

    a {
      text-decoration: none;
      color: #4080ea;

      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

export const Content = styled.main`
  max-width: 1120px;
  margin: 64px auto;
  display: flex;
  justify-content: center;
`;

export const Section = styled.section`
  margin-top: 48px;

  > strong {
    color: #999591;
    font-size: 40px;
    line-height: 26px;
    display: block;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }

  p {
    color: #999591;
  }

  > a {
    button {
      margin-top: 40px;
    }
  }
`;
